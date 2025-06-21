import router from './router.js';
import RecipeList from './RecipeList.js';
import AddRecipeForm from './AddRecipeForm.js';

const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      recipes: [],
      searchQuery: '',
      username: '',
      password: '',
      authError: '',
      isLoggedIn: false,
      isRegistering: false,
      showAddRecipeForm: false
    }
  },
  mounted() {
    this.checkAuth();
    this.fetchRecipes();
  },
  computed: {
    showRecipeList() {
      return this.$route.path === '/';
    },
    showRecipeDetail() {
      return this.$route.path.startsWith('/recipes/');
    }
  },
  methods: {
    async fetchRecipes() {
        try {
            const response = await fetch('/recipes');
            if (response.ok) {
            const data = await response.json();
            this.recipes = data; // Просто присваиваем данные без рекурсии
            console.log('Рецепты загружены:', data);
        } else {
            console.error('Ошибка при получении рецептов:', response.statusText);
        }
        } catch (error) {
        console.error('Ошибка при получении рецептов:', error);
        }
    },
    async searchRecipes() {
      try {
        const response = await fetch(`/recipes/search?q=${this.searchQuery}`);
        this.recipes = await response.json();
      } catch (error) {
        console.error('Ошибка при поиске рецептов:', error);
      }
    },
    async register() {
      try {
        const response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });

        if (response.ok) {
          alert('Регистрация прошла успешно!');
          this.username = '';
          this.password = '';
          this.authError = '';
          this.isRegistering = false;
        } else {
          const data = await response.json();
          this.authError = data.message || 'Ошибка при регистрации';
        }
      } catch (error) {
        console.error('Ошибка при регистрации:', error);
        this.authError = 'Ошибка при регистрации';
      }
    },

    async toggleAddRecipeForm() {
      this.showAddRecipeForm = !this.showAddRecipeForm;
      fetch('/api/recipes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
    },

    async login() {
      try {
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          console.log('Сохранённый токен:', data.token);
          this.isLoggedIn = true;
          this.password = '';
          this.authError = '';
          this.fetchRecipes();
          const decodedToken = jwt_decode(data.token);
          this.username = decodedToken.username;
        } else {
          const data = await response.json();
          this.authError = data.message || 'Ошибка при входе';
        }
      } catch (error) {
        console.error('Ошибка при входе:', error);
        this.authError = 'Ошибка при входе';
      }
    },

    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.username = '';
      this.fetchRecipes();
    },

    checkAuth() {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;
        const decodedToken = jwt_decode(token);
        this.username = decodedToken.username;
      }
    },

    toggleAuthMode() {
      this.isRegistering = !this.isRegistering;
      this.username = '';
      this.password = '';
      this.authError = '';
    },

    async submitAuth() {
      if (this.isRegistering) {
        await this.register();
      } else {
        await this.login();
      }
    }
  }
  
});

app.component('RecipeList', RecipeList); // Глобальная регистрация
app.component('AddRecipeForm', AddRecipeForm);

app.use(router);
app.mount('#app');