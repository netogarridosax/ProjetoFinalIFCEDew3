const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const webpush = require('web-push');
const multer = require('multer');
const Servico = require('./models/Servico');
const router = require('./routes/index');

require('dotenv').config();

webpush.setVapidDetails(
    'mailto:seuemail@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/seu_banco_de_dados';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conexão com o MongoDB estabelecida com sucesso');
    })
    .catch((error) => {
        console.error('Erro ao estabelecer conexão com o MongoDB:', error);
    });

app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SEGREDO_JWT,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.messages = req.session.messages;
    delete req.session.messages;
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}] ${req.method} to ${req.url}`);
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let subscriptions = [];

app.post('/subscribe', (req, res) => {
    subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({});
});

app.get('/push', (req, res) => {
    res.render('push');
});

app.get('/notificar', (req, res) => {
    const payload = JSON.stringify({ title: req.query.msg });
    for (let subscription of subscriptions) {
        webpush.sendNotification(subscription, payload)
            .catch(error => console.error('Erro ao notificar:', error));
    }
    res.send('ok');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/_img');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

app.get('/worker.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'worker.js'));
});

app.get('/', async (req, res) => {
    try {
        const servicos = await Servico.find();
        res.render('index', { servicos, carrinho: req.session.carrinho || [] });
    } catch (error) {
        console.error('Erro ao carregar servicos:', error);
        res.status(500).send('Erro ao carregar servicos');
    }
});

const carrinho = [];

app.post('/adicionar-ao-carrinho/:id', async (req, res) => {
    const servicoId = req.params.id;
    const servico = await Servico.findById(servicoId);
    if (servico) {
        carrinho.push(servico);
        res.redirect('/');
    } else {
        res.status(404).send('Servico não encontrado');
    }
});

app.use((req, res, next) => {
    if (!req.session.carrinho) {
        req.session.carrinho = [];
    }
    next();
});

app.get('/servicos/criar', (req, res) => {
    res.render('criar_servico', { 
        success: req.flash('success'),
        error: req.flash('error') 
    });
});

app.post('/servicos', upload.single('imagem'), async (req, res) => {
    try {
        let imagem = req.file ? req.file.filename : null;
        const novoServico = await Servico.create({...req.body, imagem: imagem});
        req.flash('success', 'Servico cadastrado com sucesso');
        res.redirect('/servicos/criar');
    } catch (error) {
        console.error('Erro ao cadastrar servico:', error);
        req.flash('error', 'Erro ao cadastrar servico');
        res.redirect('/servicos/criar');
    }
});

app.get('/servicos/editar/:id', async (req, res) => {
    try {
        const servico = await Servico.findById(req.params.id);
        if (!servico) {
            req.flash('error', 'Servico não encontrado');
            return res.redirect('/servicos');
        }
        res.render('editar_servico', { servico, success: req.flash('success'), error: req.flash('error') });
    } catch (error) {
        console.error('Erro ao buscar servico:', error);
        req.flash('error', 'Erro ao buscar servico');
        res.redirect('/servicos');
    }
});

app.put('/servicos/:id', async (req, res) => {
    try {
        const servico = await Servico.findById(req.params.id);
        if (!servico) {
            req.flash('error', 'Servico não encontrado');
            return res.redirect('/servicos');
        }

        servico.nome = req.body.nome;
        servico.categoria = req.body.categoria;
        servico.preco = req.body.preco;
        servico.tamanho = req.body.tamanho;
        servico.descricao = req.body.descricao;

        await servico.save();
        
        req.flash('success', 'Servico atualizado com sucesso');
        res.redirect('/servicos');
    } catch (error) {
        console.error('Erro ao atualizar servico:', error);
        req.flash('error', 'Erro ao atualizar servico');
        res.redirect('/servicos');
    }
});

app.use('/', router);

app.use((req, res, next) => {
    res.status(404).send('Página não encontrada');
});

mongoose.connection.on('connected', () => {
    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
});
