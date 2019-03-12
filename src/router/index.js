import Vue from 'vue'
import Router from 'vue-router'
import Import from '@/components/Import'
import Create from '@/components/Create'
// import Info from '@/components/Info'
import Transfer from '../components/Transfer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/create'
    },
    {
      path: '/create',
      name: 'Create',
      component: Create
    },
    {
      path: '/import',
      name: 'Import',
      component: Import
    },
    {
      path: '/transfer',
      name: 'Transfer',
      component: Transfer
    }
  ]
})
