"use strict";const FS = require('fs');








function extract_data(data, delimiter) {
    let out = { header: {  }, dados: [] };
    let data_rows =  data.split('\n'),  header = data_rows[0].split(delimiter);
    
    for (let i = 0; i < header.length; i++) {
        header[i] = header[i].replace('\r', '');
        out.header[header[i]] = typeof(header[i]);
    }


    for (let i = 1; i < data_rows.length; i++) {
        let list = data_rows[i].split(delimiter), element = {  };
        element['id'] = i;

        for (let j = 0; j < list.length; j++) element[header[j]] = list[j].replace('\r', '');
        out.dados.push(element);
    }
    return out;
}


function read_csv(
    path,
    delimiter=';'
    ) {
    let txt = FS.readFileSync(path, "utf-8");
    return extract_data(txt, delimiter);
}


function withColumn(data, column, value, condition=false) {
    data.header[column] = String(typeof(value));
    for (let i = 0; i < data.dados.length; i++) {
        if (condition) {
            if(condition(column, value)) data.dados[i][column] = value;
        }
        else data.dados[i][column] = value;
    }
    return data;
}


function withColumnRenamed(data, column_name, new_column_name) {
    data.header[new_column_name] = data.header[column_name];
    delete data.header[column_name];
    return data;
}


module.exports = {
    extract_data,
    read_csv,
    withColumn,
    withColumnRenamed
};