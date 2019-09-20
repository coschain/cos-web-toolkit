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
import Home from '../components/Home'
import Account from '../components/Account'
import AccountName from '../components/AccountName'
import Generate from '../components/Generate'
import DoubleCheck from '../components/DoubleCheck'

Vue.use(Router)

let routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/account',
    name: 'Account',
    component: Account
  },
  {
    path: '/accountname',
    name: 'AccountName',
    component: AccountName
  },
  {
    path: '/generate',
    name: 'Generate',
    component: Generate,
    props: true
  },
  {
    path: '/doublecheck',
    name: 'DoubleCheck',
    component: DoubleCheck,
    props: true
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
