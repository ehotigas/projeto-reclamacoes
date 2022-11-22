from models.SharePoint import SharePoint
from threading import Thread
from time import sleep


class SharePointMonitor(Thread):
        def __init__(self, sharePoint: SharePoint, file_path: str, file_name: str):
            Thread.__init__(self)
            self.sharePoint = sharePoint
            self.file_path = file_path
            self.file_name = file_name
            self.fileChanged = False
            self.lastChanged = ""
            self.run_flag = True



        def getFile(self) -> any:
            for file in self.sharePoint.getSubFolders(self.file_path)['sub_folders']:
                if self.file_name == file.properties['Name']:
                    return file


        def getLastChanged(self) -> None:
            return self.getFile().properties['TimeLastModified']
        

        def fileChangeMonitor(self) -> bool:
            if self.getLastChanged() != self.lastChanged:
                self.lastChanged = self.getLastChanged()
                self.fileChanged = True
                   

        def run(self) -> None:
            while self.run_flag:
                self.fileChangeMonitor()
                sleep(3600)
