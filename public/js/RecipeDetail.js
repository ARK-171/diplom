export default {
  template: `
    <div class="recipe-detail-container">
      <button @click="$router.push('/')" class="back-button">
        ← Назад к списку
      </button>

      <div v-if="loading">Загрузка рецепта...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="recipe">
        <h2>{{ recipe.title }}</h2>
        <div class="recipe-content">
          <h3>Ингредиенты:</h3>
          <pre>{{ recipe.ingredients }}</pre>
          <h3>Инструкции:</h3>
          <pre>{{ recipe.instructions }}</pre>
        </div>
      </div>
      <div v-else class="not-found">
        <p>Рецепт не найден</p>
      </div>
    </div>
  `,
  props: ['id'],
  data() {
    return {
      recipe: null,
      loading: false,
      error: null
    };
  },
  methods: {
    async loadRecipe(recipeId) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Загружаем рецепт ID:', recipeId);
        const response = await fetch(`/recipes/`);
        
        if (!response.ok) {
          throw new Error('Рецепт не найден');
        }
        
        const data = await response.json();
        console.log('Ответ сервера:', data[recipeId - 1]);
        this.recipe = data[recipeId - 1];
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
        this.loadRecipe(this.id); // Загружаем рецепт при монтировании
    },
    watch: {
      id: { // Отслеживаем изменения props.id
        handler(newId) {
            this.loadRecipe(newId); // Загружаем новый рецепт, когда id меняется
        }
      }
    }
};