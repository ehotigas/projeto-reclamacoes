class SharePoint {
    link: string;
    user: string;
    pass: string;
    public constructor(link: string, user: string, pass: string) {
        this.link = link;
        this.user = user;
        this.pass = pass;
    }
}

class Csv {
    header: Object;
    dados: object[];
    public constructor(header: Object, dados: object[]) {

    }
}

module.exports({
    Csv,
    SharePoint
})