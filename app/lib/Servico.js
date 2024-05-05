class Servico {
    constructor(nome, categoria, preco, quantidade, descricao, imagem) {
        if (!nome || !categoria || !preco || !quantidade || !descricao || !imagem) {
            throw new Error('Todos os parâmetros são necessários.');
        }

        if (typeof preco !== 'number' || isNaN(preco)) {
            throw new TypeError('O preço deve ser um número.');
        }

        if (typeof quantidade !== 'number' || isNaN(quantidade)) {
            throw new TypeError('A quantidade deve ser um número.');
        }

        this.nome = nome;
        this.categoria = categoria;
        this.preco = parseFloat(preco).toFixed(2); // Converte para número e formata para duas casas decimais
        this.quantidade = quantidade;
        this.descricao = descricao;
        this.imagem = imagem;
    }
}

module.exports = Servico;
