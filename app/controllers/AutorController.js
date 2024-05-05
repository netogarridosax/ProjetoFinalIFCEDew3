class AutorController {
    index(req, res) {
        const autor = {
            nome: 'Autor: Garrido',
            formacoes: [
                'Cursando Técnico em Informática para Web ',
                'IFCE',
                'Ano: 2023'
            ],
            experiencias: [
                'CB CET do Exército Brasileiro',
                'Ano: Desde 2017'
            ]
        };

        res.render('autor', autor);
    }
}

module.exports = AutorController;