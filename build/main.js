"use strict";const { read_csv, withColumn, withColumnRenamed } = require('./models/Csv');
const { readJSON, renameDataColumns } = require('./models/functions');
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
            console.log(csv);
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
    console.log('conectado');
});

io.on('teste', (data) => {
    console.log(data);
    console.log('evento');
})


io.listen(PORT);
console.info(`Listening on http://localhost:${PORT}`);
