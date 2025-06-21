const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

//router.post('/', authMiddleware, recipeController.createRecipe);
router.post('/recipes', authMiddleware, recipeController.createRecipe);
router.get('/', recipeController.getAllRecipes);
router.get('/search', recipeController.searchRecipes);
//router.get('/recipes/:id', recipeController.getRecipeById);

router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Рецепт не найден' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;