import { Download, IAuthOptions } from 'sp-download';


export default function download(
    sharePoint: SharePoint,
    file_path: string,
    out_path: string,
    callback: any
    ): void {

    const authContext: IAuthOptions = {
        username: sharePoint.user,
        password: sharePoint.pass
    };

    const download = new Download(authContext);
    download.downloadFile(sharePoint.link + file_path, out_path)
    .then(callback)
    .catch((error: string): void => {
      console.log(error);
    });
}

