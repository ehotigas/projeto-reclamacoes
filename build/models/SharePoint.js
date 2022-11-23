"use strict";var _spdownload = require('sp-download');








function download(
    sharePoint,
    file_path,
    out_path,
    callback
    ) {

    const authContext = {
        username: sharePoint.user,
        password: sharePoint.pass
    };
    console.log(sharePoint.link + file_path);
    const download = new (0, _spdownload.Download)(authContext);
    download.downloadFile(sharePoint.link + file_path, out_path)
    .then(callback)
    .catch((error) => {
      console.log(error);
    });
}

module.exports = {
    download
}