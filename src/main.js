// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(BootstrapVue)

const store = new Vuex.Store({
  state: {
    username: '',
    privkey: ''
  },
  mutations: {
    setUsername (state, username) {
      state.username = username
    },
    setPrivkey (state, privkey) {
      state.privkey = privkey
    }
  },
  getters: {
    ok: state => {
      return state.username.length > 0 && state.privkey.length > 0
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
