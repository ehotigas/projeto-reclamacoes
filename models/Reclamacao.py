class Reclamacao:
    def __init__(
                 self, id: int, vertrag: str, opbel: str, tariftyp: str, classe: str, anlage: str, anomes: str, vkont: str, city1: str, ClasseTxt: str,
                 Subclasse: str, Modalidade: str, Subgrupo: str, tipofat: str, Consumo: float, Demanda: float, billing_period: str, DiasFatura: int,
                 De: str, Ate: str, belnr: str, ablbelnr: str, MotivoLeitura: int, UnidadeLeitura: str, eq1: int, Registrador: int, DataLeitura: str,
                 TipoLeitura: int, Leitura: str

        ) -> None:
        self.id = int(id)
        self.vertrag = vertrag
        self.opbel = opbel
        self.tariftyp = tariftyp

    
    def __getAttrType__(self, attr: str) -> str:
        value = object.__getattribute__(self, attr)
        typ = type(value)

        return str(typ).split("'")[1]


    def __str__(self) -> str:
        """
            format: {attribute}:{attribute value}
            item separator -> ,
        """
        out = ""
        attrList = [x for x in dir(self) if not "__" in x]
        for attr in attrList:
            out += f'{attr}:{object.__getattribute__(self, attr)}'
            if attr != attrList[-1]:
                out += ','

        return out
