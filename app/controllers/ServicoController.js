const Servico = require('../models/Servico');

class ServicoController {
    async create(req, res) {
        try {
            const { nome, descricao, preco } = req.body;
            const servico = await Servico.create({ nome, descricao, preco });
            res.redirect('/servicos');
        } catch (error) {
            console.error('Erro ao criar serviço:', error);
            res.status(500).send('Erro ao criar serviço');
        }
    }

    async list(req, res) {
        try {
            const servicos = await Servico.find();
            res.render('servicos', { servicos });
        } catch (error) {
            console.error('Erro ao listar serviços:', error);
            res.status(500).send('Erro ao listar serviços');
        }
    }

    async edit(req, res) {
        const { id } = req.params;
        try {
            const servico = await Servico.findById(id);
            if (!servico) {
                return res.status(404).send('Serviço não encontrado');
            }
            res.render('editar_servico', { servico });
        } catch (error) {
            console.error('Erro ao editar serviço:', error);
            res.status(500).send('Erro ao editar serviço');
        }
    }

    async update(req, res) {
        try {
            const { id, nome, descricao, preco } = req.body;
            await Servico.findByIdAndUpdate(id, { nome, descricao, preco });
            res.redirect('/servicos');
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            res.status(500).send('Erro ao atualizar serviço');
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        try {
            await Servico.findByIdAndDelete(id);
            req.session.messages = { success: 'Serviço excluído com sucesso.' };
            res.redirect('/servicos');
        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            res.status(500).send('Erro ao excluir serviço');
        }
    }

    async getById(req, res) {
        const { id } = req.params;
        try {
            const servico = await Servico.findById(id);
            res.render('detalhes_servico', { servico });
        } catch (error) {
            console.error('Erro ao obter detalhes do serviço:', error);
            res.status(500).send('Erro ao obter detalhes do serviço');
        }
    }
}

module.exports = ServicoController;
