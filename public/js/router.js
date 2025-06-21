import RecipeList from './RecipeList.js';
import RecipeDetail from './RecipeDetail.js';

const routes = [
  {
    path: '/',
    component: {
      template: '<RecipeList :recipes="$parent.recipes" />'
    }
  },
  {
    path: '/recipes/:id',
    component: RecipeDetail,
    props: true,
  }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

export default router;