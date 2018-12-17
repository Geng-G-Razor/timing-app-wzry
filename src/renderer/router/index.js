import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'timing',
      component: require('@/components/Timing').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
