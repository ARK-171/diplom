const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
  async register(req, res) {
    try {
      const { username, password } = req.body;

      const existingUser = await User.findUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.createUser(username, hashedPassword);

      const userWithoutPassword = { id: newUser.id, username: newUser.username };
      res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user: userWithoutPassword });
    } catch (error) {
      console.error('Ошибка при регистрации пользователя:', error);
      res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
    }
  },

  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
      }

      const token = jwt.sign({ userId: user.id, username: user.username, iat: Math.floor(Date.now() / 1000),exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ message: 'Авторизация прошла успешно', token: token });
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      res.status(500).json({ message: 'Ошибка при авторизации' });
    }
  },

  async getUserInfo(req, res) {
    res.json({ username: req.user.username });
  },
};

module.exports = authController;