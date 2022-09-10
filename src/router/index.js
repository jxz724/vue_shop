import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import home from '@/components/home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/home',
      name: 'home',
      component: home
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
