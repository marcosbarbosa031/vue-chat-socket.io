import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import UUID from 'vue-uuid'

Vue.use(UUID)
Vue.config.productionTip = false

// Captalize filter
Vue.filter('captalize', value => {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
