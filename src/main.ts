const { download } = require("./models/SharePoint");
const { readJSON } = require('./models/functions');
const { read_csv } = require('./models/Csv');
import { Server } from "socket.io";


const credentials: Object = readJSON("./credentials.json");
const PORT: number = Number(process.env.PORT) || 50001, timeout: number = 1800000;
let csv: Csv = read_csv(credentials["out"] + credentials["file_name"], ";");

const set_csv = (): void => {
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


const io = new Server({
  
});


io.on("connection", (socket: any): void => {
    io.sockets.emit('send_data', csv);
    console.log('conectado');
});

io.on('teste', (data: Object): void => {
    console.log(data);
    console.log('evento');
})


io.listen(PORT);
console.info(`Listening on http://localhost:${PORT}`);
