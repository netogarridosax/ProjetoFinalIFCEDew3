const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

class AdminController {
  async login(req, res) {
    try {
      const { nome, senha } = req.body;

      if (!nome || !senha) {
        return res.status(400).json({ error: 'Nome de usuário e senha são necessários' });
      }

      const admin = await Admin.findOne({ nome });

      if (!admin) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      const isPasswordMatch = await bcrypt.compare(senha, admin.senha);

      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Usuário ou senha inválidos' });
      }

      const token = generateToken({ id: admin.id, nome: admin.nome });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/admin');
    } catch (error) {
      console.error('Erro durante o login:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  showLoginForm(req, res) {
    res.render('login', { messages: req.flash() });
  }

  async create(req, res) {
    try {
      const { nome, senha } = req.body;
      const hashedPassword = await bcrypt.hash(senha, 10);
      const admin = new Admin({ nome, senha: hashedPassword });
      await admin.save();
      res.redirect('/admins');
    } catch (error) {
      console.error('Erro ao criar administrador:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async list(req, res) {
    try {
      const admins = await Admin.find();
      res.render('admins', { admins, messages: req.flash() });
    } catch (error) {
      console.error('Erro ao listar administradores:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(req, res) {
    try {
      const { id, nome, senha } = req.body;
      const hashedPassword = await bcrypt.hash(senha, 10);
      await Admin.findByIdAndUpdate(id, { nome, senha: hashedPassword });
      res.redirect('/admin');
    } catch (error) {
      console.error('Erro ao atualizar administrador:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await Admin.findByIdAndRemove(id);
      res.redirect('/admin');
    } catch (error) {
      console.error('Erro ao excluir administrador:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const admin = await Admin.findById(id);
      res.render('admin', { admin });
    } catch (error) {
      console.error('Erro ao buscar administrador por ID:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = AdminController;
