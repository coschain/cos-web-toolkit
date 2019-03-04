import Vue from 'vue'
import Router from 'vue-router'
import Create from '@/components/Create'
import Home from '@/components/Home'
import Wallet from '@/components/Wallet'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/create/:pubkey',
      name: 'Create',
      component: Create,
      props: true
    },
    {
      path: '/wallet',
      name: 'Wallet',
      component: Wallet
    }
  ]
})
