import download from "./models/SharePoint";
import { Server } from "socket.io";


const PORT: number = Number(process.env.PORT) || 50001, timeout: number = 1800000;
let csv: Csv = read_csv("out_path", ";");

const set_csv = (): void => {
    download(
        new SharePoint("link", "user", "pass"),
        "file_path",
        "out_path",
        () => { csv = read_csv("out_path") }
    );

    setTimeout(set_csv, timeout);
}

setTimeout(set_csv, timeout);


const io = new Server({
  
});


io.on("connection", (socket: any): void => {
    io.sockets.emit('send_data', csv);
    console.log('conectado')
});

io.on('teste', (data: Object): void => {
    console.log(data);
    console.log('evento')
})


io.listen(PORT);
console.info(`Listening on http://localhost:${PORT}`);
