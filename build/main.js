"use strict";const { download } = require("./models/SharePoint");
const { readJSON } = require('./models/functions');
const { read_csv } = require('./models/Csv');
var _socketio = require('socket.io');


const credentials = readJSON("./credentials.json");
const PORT = Number(process.env.PORT) || 50001, timeout = 1800000;
let csv = read_csv(credentials["out"] + credentials["file_name"], ";");

const set_csv = () => {
    download(
        { link: credentials["link_sharepoint"], user: credentials["email"], pass: credentials["pass"] },
        credentials["file_path"],
        credentials["out"],
        () => {
            csv = read_csv(credentials["out"] + credentials["file_name"]);
            io.sockets.emit('send_data', csv);
            console.log(csv);
            
        }
    );

    setTimeout(set_csv, timeout);
}

setTimeout(set_csv, timeout);


const io = new (0, _socketio.Server)({
  
});


io.on("connection", (socket) => {
    io.sockets.emit('send_data', csv);
    console.log('conectado')
});

io.on('teste', (data) => {
    console.log(data);
    console.log('evento')
})


io.listen(PORT);
console.info(`Listening on http://localhost:${PORT}`);
