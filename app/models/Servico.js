const mongoose = require('mongoose');

const ServicoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    // Adicione validação adicional, se necessário
  },
  preco: {
    type: Number,
    required: true
  },
  quantidade: {
    type: Number,
    // Adicione validação adicional, se necessário
  },
  descricao: {
    type: String,
    required: true
  },
  imagem: {
    type: String
  },
});

// Adicione índices, se necessário

module.exports = mongoose.model('Servico', ServicoSchema);
