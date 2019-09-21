import Vue from 'vue'
import Router from 'vue-router'
// import Info from '@/components/Info'
import Transfer from '../components/Transfer'
import Post from '../components/Post'
import Faucet from '../components/Faucet'
import Exchange from '../components/Exchange'
import Contract from '../components/Contract'
import BpVote from '../components/BpVote'
import Choice from '../components/Choice'
import Account from '../components/Account'
import AccountName from '../components/AccountName'
import Generate from '../components/Generate'
import CheckAndCreate from '../components/CheckAndCreate'
import CreateSuccess from '../components/CreateSuccess'
import ImportSuccess from '../components/ImportSuccess'
import AccountUpdate from '../components/AccountUpdate'

Vue.use(Router)

let routes = [
  {
    path: '/',
    redirect: {name: 'Account'}
  },
  {
    path: '/Choice',
    name: 'Choice',
    component: Choice
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/accountupdate',
    name: 'AccountUpdate',
    component: AccountUpdate
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
    path: '/checkandcreate',
    name: 'CheckAndCreate',
    component: CheckAndCreate,
    props: true
  },
  {
    path: '/createsuccess',
    name: 'CreateSuccess',
    component: CreateSuccess,
    props: true
  },
  {
    path: '/importsuccess',
    name: 'ImportSuccess',
    component: ImportSuccess,
    props: true
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
