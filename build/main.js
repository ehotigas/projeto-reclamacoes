"use strict";const { readJSON, renameDataColumns, insertUser, removeUser } = require('./models/functions');
const { read_csv, withColumn } = require('./models/Csv');
const { download } = require("./models/SharePoint");
var _socketio = require('socket.io');


const settings = readJSON("./credentials.json");
const PORT = Number(process.env.PORT) || 50001, timeout = 3600000 // -> 1h;
let csv = read_csv(settings["out"] + settings["file_name"], ";");


const set_csv = () => {
    download(
        { link: settings["link_sharepoint"], user: settings["email"], pass: settings["pass"] },
        settings["file_path"] + settings["file_name"],
        settings["out"],
        () => {
            csv = read_csv(settings["out"] + settings["file_name"]);
            csv = withColumn(csv, 'User', '-');
            csv = renameDataColumns(csv);
            console.log("Data Sent");
            console.log(csv.header);
            io.sockets.emit('send_data', csv);
        }
    );
    setTimeout(set_csv, timeout);
}

set_csv();


const io = new (0, _socketio.Server)({
  
});


io.on("connection", (socket) => {
    io.sockets.emit('send_data', csv);
    console.log(`${socket.id} conectado`);
    socket.on('to_home', (user) => {
        removeUser(csv, user);
        io.sockets.emit('send_data', csv);
    });
    socket.on('row_click', (row) => {
        csv = insertUser(csv, row);
        io.sockets.emit('send_data', csv);
    });
});


io.listen(PORT);
console.info(`Listening on http://localhost:${PORT}`);
