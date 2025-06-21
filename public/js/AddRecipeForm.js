export default {
  template: `
    <div class="add-recipe-form">
      <h2>Добавить новый рецепт</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Название:</label>
          <input v-model="form.title" type="text" required>
        </div>
        
        <div class="form-group">
          <label>Ингредиенты:</label>
          <textarea v-model="form.ingredients" required></textarea>
        </div>
        
        <div class="form-group">
          <label>Инструкции:</label>
          <textarea v-model="form.instructions" required></textarea>
        </div>
        
        <button type="submit" :disabled="loading">
          {{ loading ? 'Сохранение...' : 'Добавить рецепт' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
      </form>
    </div>
  `,

  data() {
    return {
      form: {
        title: '',
        ingredients: '',
        instructions: ''
      },
      loading: false,
      error: '',
      success: ''
    };
  },

  methods: {
    async submitForm() {
      this.loading = true;
      this.error = '';
      this.success = '';
      
      try {
        const response = await fetch('/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(this.form)
        });
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Ожидался JSON, получили: ${text.slice(0, 100)}...`);
        }
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Ошибка при создании рецепта');
        }

        this.success = 'Рецепт успешно добавлен!';
        this.form = { title: '', ingredients: '', instructions: '' };
        
        // Обновляем список рецептов
        this.$emit('recipe-created');
        
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};