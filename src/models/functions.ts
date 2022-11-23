const fs = require('fs');

function readJSON(path: string): Object {
    try {
        const jsonString: string = fs.readFileSync(path);
        return JSON.parse(jsonString);
      } catch (err) {
        console.log(err);
        return {  };
      }
}

function renameDataColumns(data: Csv): Csv {
    const columns = { 
        anlage: 'Instalação', city1: 'Município', opbel: 'DocFat',
        Consumo: 'Cons (MWh)', Demanda: 'Dem (MWh)', DiasFatura: 'Dias',
        Medicao: 'Medicao (KWh)', eq1: 'Medidor'
    };
    Object.keys(columns).forEach(element => { data = withColumnRenamed(data, element, columns[element]) });
    return data;
}

module.exports = {
    readJSON,
    renameDataColumns
};