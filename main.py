#!/usr/bin/server python
# coding: utf-8

from models.SharePointMonitor import *
from models.ReadCSV import ReadCSV
from os import system
import json


header_types = {
    # 'vertrag': 'number',
    'opbel': 'number',
    'classe': 'number',
    'anlage': 'number',
    'vkont': 'number',
    'Consumo': 'number',
    'Demanda': 'number',
    'belnr': 'number',
    'ablbelnr': 'number',
    'MotivoLeitura': 'number',
    'eq1': 'number',
    'Registrador': 'number',
    'TipoLeitura': 'number',
    'Leitura': 'number',
    'StatusLeitura': 'number',
    'Medicao': 'number',
    'DataLigacaoUC': 'number',
    'DataEncerramentoContrato': 'number',
    'anomes': 'number',
    'De': 'date',
    'Ate': 'date'
}


def print_data(path: str) -> None:
    data = ReadCSV(path, ';')

    for column, type in header_types.items():
        data.setColumnType(column, type)

    print(str(data))



def main() -> None:
    configs = json.load(open('./credentials.json'))
    sharepoint_link = configs['link_sharepoint']
    login_email = configs['email']
    login_pass = configs['pass']
    file_path = configs['file_path']
    file_name = configs['file_name']
    out = configs['out']

    sp = SharePoint(sharepoint_link, login_email, login_pass)
    sharepoint_monitor = SharePointMonitor(sp, file_path, file_name)
    sharepoint_monitor.start()

    loop_flag = True
    while loop_flag:
        if sharepoint_monitor.fileChanged:
            sp.downloadFile(file_path, file_name, out)
            sharepoint_monitor.fileChanged = False
            print_data(out)

    
            
if __name__ == '__main__':
    main()
