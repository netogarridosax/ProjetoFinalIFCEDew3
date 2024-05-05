const express = require('express');
const router = express.Router();
const ServicoController = require('../controllers/ServicoController');
const AdminController = require('../controllers/AdminController');
const UsuarioController = require('../controllers/UsuarioController');
const AutorController = require('../controllers/AutorController');
const AuthController = require('../controllers/AuthController');
const flash = require('connect-flash');

const adminController = new AdminController();
const usuarioController = new UsuarioController();
const autorController = new AutorController();
const servicoController = new ServicoController();

router.use(flash());

// Rotas para edição de serviços
router.get('/servicos/editar/:id', AuthController.auth, (req, res) => {
    const { id } = req.params;
    ServicoController.editar(req, res);
});

// Rotas relacionadas a administração
router.get('/admin', adminController.list);
router.get('/admin/create', (req, res) => res.render('criar_admin'));
router.post('/admin/create', adminController.create);
router.get('/admin/login', adminController.showLoginForm);
router.post('/admin/login', adminController.login);
router.get('/admins', adminController.list);

// Rotas relacionadas a usuários
router.get('/usuario', AuthController.auth, usuarioController.list);

// Rotas para manipulação de serviços
router.post('/servicos', AuthController.auth, servicoController.create);
router.get('/servicos', AuthController.auth, servicoController.list);
router.put('/servicos/:id', AuthController.auth, servicoController.update);
router.delete('/servicos/:id', AuthController.auth, servicoController.delete);
router.get('/servicos/:id', AuthController.auth, servicoController.getById);

// Rota inicial
router.get('/', (req, res) => res.render('index'));

// Rota para informações sobre o autor
router.get('/autor', autorController.index);

module.exports = router;
