// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

module.exports = async (req, res, next) => {
  try {
    // 1. Проверка заголовка Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Требуется аутентификация' 
      });
    }

    // 2. Извлечение токена
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Неверный формат токена' });
    }

    // 3. Верификация токена
    console.log('Проверяемый токен:', token); // Логирование
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'установлен' : 'отсутствует');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Проверка пользователя в БД
    const userQuery = await pool.query(
      'SELECT id, username FROM users WHERE id = $1', 
      [decoded.userId]
    );
    
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Пользователь не найден' 
      });
    }

    // 5. Добавляем пользователя в запрос
    req.user = userQuery.rows[0];
    next();

  } catch (err) {
    console.error('Ошибка аутентификации:', err);
    
    const message = err.name === 'JsonWebTokenError' 
      ? 'Неверный токен' 
      : 'Ошибка аутентификации';
    
    res.status(401).json({ 
      success: false,
      message 
    });
  }
};