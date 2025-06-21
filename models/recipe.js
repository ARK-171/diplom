const { pool } = require('../config/db');

const Recipe = {
  async createRecipe(title, ingredients, instructions, userId) {
    const query = `
      INSERT INTO recipes (title, ingredients, instructions, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [title, ingredients, instructions, userId];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Ошибка при создании рецепта:', error);
      throw error;
    }
  },

  async getAllRecipes() {
    const query = 'SELECT * FROM recipes';
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Ошибка при получении рецептов:', error);
      throw error;
    }
  },

  async searchRecipes(searchTerm) {
    const query = `
      SELECT * FROM recipes
      WHERE title ILIKE $1 OR ingredients ILIKE $1 OR instructions ILIKE $1
    `;
    const values = [`%${searchTerm}%`];
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Ошибка при поиске рецептов:', error);
      throw error;
    }
  },

  async getRecipeById(id) {
    const query = 'SELECT * FROM recipes WHERE id = $1';
    const values = [id];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Ошибка при получении рецепта:', error);
      throw error;
    }
  },
};

module.exports = Recipe;