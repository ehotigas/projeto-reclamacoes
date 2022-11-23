const FS = require('fs');


interface Csv {
    header: Object;
    dados: object[];
}


function extract_data(data: string, delimiter: string): Csv {
    let out: Csv = { header: {  }, dados: [] };
    let data_rows: string[] =  data.split('\n'),  header: string[] = data_rows[0].split(delimiter);
    
    for (let i = 0; i < header.length; i++) {
        header[i] = header[i].replace('\r', '');
        out.header[header[i]] = typeof(header[i]);
    }


    for (let i = 1; i < data_rows.length; i++) {
        let list: string[] = data_rows[i].split(delimiter), element: Object = {  };
        element['id'] = i;

        for (let j = 0; j < list.length; j++) element[header[j]] = list[j].replace('\r', '');
        out.dados.push(element);
    }
    return out;
}


function read_csv(
    path: string,
    delimiter: string=';'
    ): Csv {
    let txt: string = FS.readFileSync(path, "utf-8");
    return extract_data(txt, delimiter);
}


function withColumn(data: Csv, column: string, value: any, condition: any=false): Csv {
    data.header[column] = String(typeof(value));
    for (let i = 0; i < data.dados.length; i++) {
        if (condition) {
            if(condition(column, value)) data.dados[i][column] = value;
        }
        else data.dados[i][column] = value;
    }
    return data;
}


function withColumnRenamed(data: Csv, column_name: string, new_column_name: string): Csv {
    data.header[new_column_name] = data.header[column_name];
    delete data.header[column_name];

    data.dados.forEach(element => {
        element[new_column_name] = element[column_name];
        delete element[column_name];
    });
    
    return data;
}


module.exports = {
    extract_data,
    read_csv,
    withColumn,
    withColumnRenamed
};