export default {
  template: `
    <div>
      <h2>Список рецептов</h2>
      <ul>
        <li v-for="recipe in recipes" :key="recipe.id">
          <router-link :to="'/recipes/' + recipe.id">{{ recipe.title }}</router-link>
        </li>
      </ul>
    </div>
  `,
  props: ['recipes'],
};