import Vue from 'vue'
import Router from 'vue-router'
import Import from '@/components/Import'
import Create from '@/components/Create'
// import Info from '@/components/Info'
import Transfer from '../components/Transfer'
import Post from '../components/Post'
import Faucet from '../components/Faucet'

Vue.use(Router)

let routes = [
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
  },
  {
    path: '/post',
    name: 'Post',
    component: Post
  }
]

if (process.env.VUE_APP_FAUCET) {
  routes.push({
    path: '/faucet',
    name: 'Faucet',
    component: Faucet
  })
}

export default new Router({
  routes
})
