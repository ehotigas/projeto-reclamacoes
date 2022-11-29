const { readJSON, renameDataColumns, insertUser, removeUser } = require('./models/functions');
const { read_csv, withColumn } = require('./models/Csv');
const { download } = require("./models/SharePoint");
import { Server } from "socket.io";


const settings: Object = readJSON("./credentials.json");
const PORT: number = Number(process.env.PORT) || 50001, timeout: number = 86400000 // -> 24h;
let csv: Csv = read_csv(settings["out"] + settings["file_name"], ";");


const set_csv = (): void => {
    download(
        { link: settings["link_sharepoint"], user: settings["email"], pass: settings["pass"] },
        settings["file_path"] + settings["file_name"],
        settings["out"],
        () => {
            csv = read_csv(settings["out"] + settings["file_name"]);
            csv = withColumn(csv, 'User', '-');
            csv = renameDataColumns(csv);
            console.log("Data Sent");
            io.sockets.emit('send_data', csv);
        }
    );
    setTimeout(set_csv, timeout);
}

set_csv();


const io = new Server({
  
});


io.on("connection", (socket: any): void => {
    io.sockets.emit('send_data', csv);
    console.log(`${socket.id} conectado`);
    socket.on('to_home', (user: string): void => {
        removeUser(csv, user);
        io.sockets.emit('send_data', csv);
    });
    socket.on('row_click', (row: RowData): void => {
        csv = insertUser(csv, row);
        io.sockets.emit('send_data', csv);
    });
});


io.listen(PORT);
console.info(`Listening on http://localhost:${PORT}`);
