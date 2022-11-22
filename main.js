const { spawn } = require("child_process");
const { Server } = require("socket.io");


function withColumn(data, column, value, condition=false) {
    data.header[column] = typeof(value);
    for (let i = 0; i < data.dados.length; i++) {
        if (condition) {
            if(condition(column, value)) dados.dados[i][column] = value;
        }
        else data.dados[i][column] = value;
    }
    return data;
}


// Subprocess
let csv = { header: { id: 'number', anlage: 'number', ClasseTxt: 'str', city1: 'str', Subgrupo: 'str', Modalidade: 'str' }, dados: [{ id: '1', anlage: 'teste', ClasseTxt: 'teste', city1: 'teste', Subgrupo: 'teste', Modalidade: 'teste' }] };
const python = spawn('python', ['main.py']);
python.stdout.on('data', data => {
    let stringData = String(data), temp_csv = { header: {  }, dados: [] };

    stringData = stringData.split('|||');
    

    // Header
    stringData[0].split(',,').forEach(element => {
        let coluna = element.split(':');
        temp_csv.header[coluna[0]] = coluna[1];
    });

    if (stringData.length >= 2)  
        stringData[1].split(';').forEach(element => {
            let row = new Object();
            element.split(',,').forEach(column => {
                let value = column.split(':')
                row[value[0]] = value[1];
            })
            temp_csv.dados.push(row);
        });

    
    csv = withColumn(temp_csv, 'User', '-');
    // csv = temp_csv;
    // console.log('sent_data')
    // console.log(csv);
    io.sockets.emit('send_data', csv);
});


const PORT = process.env.PORT || 50001;


const io = new Server({
  
});


io.on("connection", socket => {
    io.sockets.emit('send_data', csv);
    console.log('conectado')
});

io.on('teste', data => {
    console.log(data);
    console.log('evento')
})


io.listen(PORT);
console.info(`Listening on http://localhost:${PORT}`);
