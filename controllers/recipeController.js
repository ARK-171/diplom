const Recipe = require('../models/recipe');



const recipeController = {
  async createRecipe(req, res) {
    try {
      const { title, ingredients, instructions } = req.body;
      const userId = req.userId;
      if (!title || !ingredients || !instructions) {
        return res.status(400).json({ 
          success: false,
          message: 'Все поля обязательны для заполнения' 
        });
      }
      const newRecipe = await Recipe.createRecipe(title, ingredients, instructions, userId);
      res.status(201).json({ message: 'Рецепт успешно добавлен', data: newRecipe });
    } catch (error) {
      console.error('Ошибка при создании рецепта:', error);
      res.status(500).json({ message: 'Ошибка при создании рецепта' });
    }
  },

  async getAllRecipes(req, res) {
    try {
      const recipes = await Recipe.getAllRecipes();
      res.json(recipes);
    } catch (error) {
      console.error('Ошибка при получении рецептов:', error);
      res.status(500).json({ message: 'Ошибка при получении рецептов' });
    }
  },

  async searchRecipes(req, res) {
    try {
      const searchTerm = req.query.q;
      if (!searchTerm) {
        return res.status(400).json({ message: 'Не указан поисковый запрос' });
      }

      const recipes = await Recipe.searchRecipes(searchTerm);
      res.json(recipes);
    } catch (error) {
      console.error('Ошибка при поиске рецептов:', error);
      res.status(500).json({ message: 'Ошибка при поиске рецептов' });
    }
  },

  async getRecipeById(req, res) {
    try {
        const recipe = await Recipe.getRecipeById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ 
                success: false,
                message: 'Рецепт не найден'
            });
        }
    
        res.json({
            success: true,
            data: {
                ...recipe,
                // Форматируем данные для фронтенда
                ingredients: formatText(recipe.ingredients),
                instructions: formatText(recipe.instructions)
            }
        });
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ 
            success: false,
            message: 'Ошибка сервера'
        });
    }
  },

};

module.exports = recipeController;