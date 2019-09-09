import Vue from 'vue'
import Router from 'vue-router'
import Create from '@/components/Create'
// import Info from '@/components/Info'
import Transfer from '../components/Transfer'
import Post from '../components/Post'
import Faucet from '../components/Faucet'
import Exchange from '../components/Exchange'
import Contract from '../components/Contract'
import BpVote from '../components/BpVote'

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
    path: '/transfer',
    name: 'Transfer',
    component: Transfer
  },
  {
    path: '/post',
    name: 'Post',
    component: Post
  },
  {
    path: '/exchange',
    name: 'Exchange',
    component: Exchange
  },
  {
    path: '/contract',
    name: 'Contract',
    component: Contract
  },
  {
    path: '/bpvote',
    name: 'BpVote',
    component: BpVote
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
