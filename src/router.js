import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import items from './data/items.json'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/:slug',
      name: 'detail',
      component: () => import('./views/Detail.vue'),
      beforeEnter: (to, from, next) => { // eslint-disable-line
        const filtered = items.filter(item => to.params.slug === item.slug)

        if (filtered.length > 0) {
          next() // continue to detail view
        } else {
          next('/') // route to home view
        }
      }
    },
  ],
})
