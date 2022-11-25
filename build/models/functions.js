"use strict";const fs = require('fs');
const wCR = require('./Csv').withColumnRenamed;








function readJSON(path) {
    try {
        const jsonString = fs.readFileSync(path);
        return JSON.parse(jsonString);
      } catch (err) {
        console.log(err);
        return {  };
      }
}


function renameDataColumns(data) {
    const columns = { 
        anlage: 'Instalação', city1: 'Município', opbel: 'DocFat',
        Consumo: 'Cons (MWh)', Demanda: 'Dem (MWh)', DiasFatura: 'Dias',
        Medicao: 'Medicao (KWh)', eq1: 'Medidor', tariftyp: 'Tipo Tarifa',
        total_amnt: 'Valor Fatura'
    };
    Object.keys(columns).forEach(element => { data = wCR(data, element, columns[element]) });
    return data;
}


function returnFirstIndex(data, row) {
    let index = row.row_id - 1;
    while (true) {
      if (data.dados[index] && data.dados[index]['Nota'] == row.numero_nota) {
          index--;
          continue;
      }
      break;
    }
        
    return index + 1;    
}


function setRowUser(data, index, user) {
    if (data.dados[index]['User'] == '-' || data.dados[index]['User'] == user) data.dados[index]['User'] = user;
    else data.dados[index]['User'] += ` / ${user}`;
}


function insertUser(data, row) {
    let index = returnFirstIndex(data, row);
    for (; data.dados[index]['Nota'] == row.numero_nota; index++) setRowUser(data, index, row.user);
    return data;
}


function removeRowUser(row_user) {
    if (!row_user.includes('/')) return '-';

    let arr = [];
    row_user.split(' / ').forEach((element) => { 
      if (!(element === row_user)) 
          arr.push(element);
    });

    return arr.join(' / ');
}


function removeUser(data, user) {
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