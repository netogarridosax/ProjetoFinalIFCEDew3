const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true,
    minlength: 8 // Exemplo de validação mínima de comprimento
  }
});

AdminSchema.pre('save', async function (next) {
  try {
    if (this.isModified('senha')) {
      const salt = await bcrypt.genSalt(10);
      this.senha = await bcrypt.hash(this.senha, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Admin', AdminSchema);
