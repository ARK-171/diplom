// models/user.js
// Здесь будет логика для работы с пользователями в базе данных (CRUD операции)
const { pool } = require('../config/db');

const User = {
  async createUser(username, password) {
    // !!! Важно: Перед сохранением пароля в базу данных его нужно захэшировать!
    //  Используйте bcrypt или аналогичную библиотеку.
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
    const values = [username, password]; // !!! Пароль должен быть захэширован
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      throw error; // Пробросить ошибку для обработки в контроллере
    }
  },

  async findUserByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const values = [username];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Ошибка при поиске пользователя:', error);
      throw error;
    }
  },
};

module.exports = User;