from office365.runtime.auth.authentication_context import AuthenticationContext
from office365.sharepoint.client_context import ClientContext
from office365.sharepoint.files.file import File
import io


class SharePoint:
    def __init__(self, sharepoint_link: str, login_email: str, login_pass: str) -> None:
        self.sharepoint_link = sharepoint_link
        self.login_email = login_email
        self.login_pass = login_pass
        

    def getSubFolders(self, file_path: str) -> dict:
        auth = AuthenticationContext(self.sharepoint_link)
        auth.acquire_token_for_user(self.login_email, self.login_pass)
        ctx = ClientContext(self.sharepoint_link, auth)
        web = ctx.web
    
        ctx.load(web)
        ctx.execute_query()
        
        folder = ctx.web.get_folder_by_server_relative_url(file_path)
        sub_folders = folder.files
        ctx.load(sub_folders)
        ctx.execute_query()

        return { 'sub_folders': sub_folders, 'ctx': ctx }


    def downloadFile(self, file_path: str, file_name: str, out_path: str) -> None:
        subFolders = self.getSubFolders(file_path)
        for file in subFolders['sub_folders']:
            url = file_path + file.properties['Name']
            
            if file_name == file.properties['Name']:
                response = File.open_binary(subFolders['ctx'], url)

                bytes_file_obj = io.BytesIO()
                bytes_file_obj.write(response.content)
                bytes_file_obj.seek(0)

                with open(out_path, "wb") as f:
                    f.write(bytes_file_obj.getbuffer())
