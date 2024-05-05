const { verifyToken } = require('../utils/jwt');

const AuthController = {
    auth: function (req, res, next) {
        try {
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).json({ error: 'Token JWT ausente' });
            }

            const payload = verifyToken(token);

            if (!payload) {
                return res.status(401).json({ error: 'Token JWT inválido' });
            }

            req.user = payload;
            next();
        } catch (error) {
            console.error('Erro durante a autenticação:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
};

module.exports = AuthController;
