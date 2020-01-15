import Vue from 'vue'
import Router from 'vue-router'
import IListenToSockets from '@/components/IListenToSockets'
import Home from '@/components/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IListenToSockets',
      component: IListenToSockets,
      mode: history
    }
  ]
})
