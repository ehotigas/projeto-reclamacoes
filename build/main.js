"use strict";const { readJSON, renameDataColumns } = require('./models/functions');
const { read_csv, withColumn } = require('./models/Csv');
const { download } = require("./models/SharePoint");
var _socketio = require('socket.io');


const credentials = readJSON("./credentials.json");
const PORT = Number(process.env.PORT) || 50001, timeout = 3600000 // -> 1h;
let csv = read_csv(credentials["out"] + credentials["file_name"], ";");

const set_csv = () => {
    download(
        { link: credentials["link_sharepoint"], user: credentials["email"], pass: credentials["pass"] },
        credentials["file_path"],
        credentials["out"],
        () => {
            csv = read_csv(credentials["out"] + credentials["file_name"]);
            csv = withColumn(csv, 'User', '-');
            csv = renameDataColumns(csv);
            io.sockets.emit('send_data', csv);
        }
    );
    setTimeout(set_csv, timeout);
}

setTimeout(set_csv, timeout);


const io = new (0, _socketio.Server)({
  
});


io.on("connection", (socket) => {
    io.sockets.emit('send_data', csv);
    console.log('conectado');
});

io.on('teste', (data) => {
    console.log(data);
    console.log('evento');
})


io.listen(PORT);
console.info(`Listening on http://localhost:${PORT}`);
