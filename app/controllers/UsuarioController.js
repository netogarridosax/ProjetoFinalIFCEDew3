const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

class UsuarioController {
  async login(req, res) {
    const { nome, senha } = req.body;

    try {
      if (!nome || !senha) {
        throw new Error('Nome de usuário e senha são necessários');
      }

      console.log(`Tentando fazer login com nome: ${nome}`);
      const usuario = await Usuario.findOne({ nome });

      if (!usuario) {
        throw new Error('Usuário ou senha inválidos');
      }

      const isPasswordMatch = await bcrypt.compare(senha, usuario.senha);

      if (!isPasswordMatch) {
        throw new Error('Usuário ou senha inválidos');
      }

      const token = generateToken({ id: usuario.id, nome: usuario.nome });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/usuario');
    } catch (error) {
      console.error('Erro durante o login:', error.message);
      return res.status(401).json({ error: error.message });
    }
  }

  async create(req, res) {
    const { nome, senha } = req.body;

    try {
      if (!nome || !senha) {
        throw new Error('Nome de usuário e senha são necessários');
      }

      const usuario = new Usuario({ nome, senha });
      await usuario.save();
      res.redirect('/usuarios');
    } catch (error) {
      console.error('Erro ao criar usuário:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  async list(req, res) {
    try {
      const usuarios = await Usuario.find();
      res.render('usuarios', { usuarios, messages: req.flash() });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).send('Erro ao listar usuários');
    }
  }

  async update(req, res) {
    const { id, nome, senha } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 10);

    try {
      await Usuario.findByIdAndUpdate(id, { nome, senha: hashedPassword });
      res.redirect('/usuario');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).send('Erro ao atualizar usuário');
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      await Usuario.findByIdAndRemove(id);
      res.redirect('/usuario');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).send('Erro ao excluir usuário');
    }
  }

  async getById(req, res) {
    const { id } = req.params;

    try {
      const usuario = await Usuario.findById(id);
      res.render('usuario', { usuario });
    } catch (error) {
      console.error('Erro ao obter usuário por ID:', error);
      res.status(500).send('Erro ao obter usuário por ID');
    }
  }
}

module.exports = UsuarioController;
