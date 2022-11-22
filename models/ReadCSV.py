import csv

class ReadCSV:
    def __init__(self, path: str, delimiter: str):
        self.path = path
        self.delimiter = delimiter
        self.data = []
        self.read()


    def set_Header(self, header: list) -> None:
        self.header = ['id']
        for i in header:
            self.header.append(i)
    
    
    def read(self) -> None:
        with open(self.path, encoding='utf-8') as file:
            
            reader = csv.reader(file, delimiter=self.delimiter)
            cont = -1
            
            for row in reader:
                if cont == -1:
                    self.set_Header(row)
                    cont += 1
                    continue

                row_data = { 'id': cont}
                i = 0
                for j in row:
                    row_data[self.header[i + 1]] = j
                    i += 1
                self.data.append(row_data)
                cont += 1
                # if cont == 2:
                #     break
        
        self.header = { k: 'str' for k in self.header }  
        

    def setColumnType(self, column: str, type: str) -> None:
        self.header[column] = type


    def __replace(self, *args: str) -> list:
        _return = []
        for arg in args:
            _return.append(str(arg).replace('\r\n', ''))
        
        return _return

                    
    
    def __str__(self) -> str:
        """
            header format: {column_1_name}:{column_1_type},...{column_n_name}:{column_n_type}|
            header delimiter: |
            row format: {column_1_name}:{column_1_value},...,{column_n_name}:{column_n_value};
            row delimiter: ;
        """
        out = ""
        cont = 0
        for column, column_type in self.header.items():
            column, column_type = self.__replace(column, column_type)
            out += f'{column}:{column_type}'
            if cont != len(self.header) - 1:
                out += ',,'
            cont += 1

        out += '|||'


        for row in self.data:
            cont = 0
            for column_name, column_data in row.items():
                column_name, column_data = self.__replace(column_name, column_data)
                out += f'{column_name}:{column_data}'
                if cont != len(self.header) - 1:
                    out += ',,'
                cont += 1

            if row != self.data[-1]:
                out += ';'

        return out
