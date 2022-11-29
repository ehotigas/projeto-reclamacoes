const fs = require('fs');
const wCR = require('./Csv').withColumnRenamed;

interface RowData {
    user: string;
    row_id: number;
    numero_nota: string;
}


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
        Consumo: 'Cons (KWh)', Demanda: 'Dem (KW)', DiasFatura: 'Dias',
        Medicao: 'Medicao (KWh)', eq1: 'Medidor', tariftyp: 'Tipo Tarifa',
        total_amnt: 'Valor Fatura (R$)', billing_period: 'ExercícioPeríodo'
    };
    Object.keys(columns).forEach(element => { data = wCR(data, element, columns[element]) });
    return data;
}


function returnFirstIndex(data: Csv, row: RowData): number {
    let index: number = row.row_id - 1;
    while (true) {
      if (data.dados[index] && data.dados[index]['Nota'] == row.numero_nota) {
          index--;
          continue;
      }
      break;
    }
        
    return index + 1;    
}


function setRowUser(data: Csv, index: number, user: string): void {
    if (data.dados[index]['User'] == '-' || data.dados[index]['User'] == user) data.dados[index]['User'] = user;
    else data.dados[index]['User'] += ` / ${user}`;
}


function insertUser(data: Csv, row: RowData): Csv {
    let index: number = returnFirstIndex(data, row);
    for (; data.dados[index]['Nota'] == row.numero_nota; index++) setRowUser(data, index, row.user);
    return data;
}


function removeRowUser(row_user: string): string {
    if (!row_user.includes('/')) return '-';

    let arr: Array<string> = [];
    row_user.split(' / ').forEach((element: string): void => { 
      if (!(element === row_user)) 
          arr.push(element);
    });

    return arr.join(' / ');
}


function removeUser(data: Csv, user: string): void {
    for (let i = 0; i < data.dados.length; i++) {
        if (data.dados[i]['User'].includes(user))
            data.dados[i]['User'] = removeRowUser(user);
    }
}


module.exports = {
    readJSON,
    renameDataColumns,
    insertUser,
    removeUser
};