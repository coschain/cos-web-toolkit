// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueAnalytics from 'vue-analytics'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(VueAnalytics, {
  id: 'UA-136959706-2',
  router: router
})

const store = new Vuex.Store({
  state: {
    username: '',
    privkey: '',
    balance: 0,
    vesting: 0,
    stake: 0,
    stamina: 0,
    withdrawEachTime: 0,
    withdrawRemains: 0,
    nextWithdraw: 0
  },
  mutations: {
    setUsername (state, username) {
      state.username = username
    },
    setPrivkey (state, privkey) {
      state.privkey = privkey
    },
    setBalance (state, balance) {
      state.balance = balance
    },
    setVesting (state, vesting) {
      state.vesting = vesting
    },
    setStake (state, stake) {
      state.stake = stake
    },
    setStamina (state, stamina) {
      state.stamina = stamina
    },
    setWithdrawEachTime (state, withdrawEachTime) {
      state.withdrawEachTime = withdrawEachTime
    },
    setWithdrawRemains (state, withdrawRemains) {
      state.withdrawRemains = withdrawRemains
    },
    setNextWithdraw (state, nextWithdraw) {
      state.nextWithdraw = nextWithdraw
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
