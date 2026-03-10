const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Hash pré-computado para a senha 'admin123' (10 salt rounds)
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123', 10);

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Gera um token JWT para autenticação
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Token gerado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/token', (req, res) => {
  const { username, password } = req.body;

  // Autenticação com bcrypt para comparação segura de senha
  if (username === 'admin' && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      message: 'Token gerado com sucesso',
      token,
      expiresIn: '24h'
    });
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
});

module.exports = router;
