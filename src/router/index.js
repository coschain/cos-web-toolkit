import Vue from 'vue'
import Router from 'vue-router'
import Import from '@/components/Import'
import Home from '@/components/Home'
// import Info from '@/components/Info'
import Transfer from '../components/Transfer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/import',
      name: 'Import',
      component: Import
    },
    // {
    //   path: '/info',
    //   name: 'Info',
    //   component: Info
    // },
    {
      path: '/transfer',
      name: 'Transfer',
      component: Transfer
    }
  ]
})
