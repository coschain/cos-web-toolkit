import Vue from 'vue'
import Router from 'vue-router'
import Transfer from '../components/Transfer'
import Delegation from '../components/Delegation'
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
import UpdateSuccess from '../components/UpdateSuccess'
import Import from '../components/Import'

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
    component: AccountUpdate,
    meta: {
      requireAuth: true
    }
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
    path: '/import',
    name: 'Import',
    component: Import
  },
  {
    path: '/importsuccess',
    name: 'ImportSuccess',
    component: ImportSuccess,
    props: true
  },
  {
    path: '/updatesuccess',
    name: 'UpdateSuccess',
    component: UpdateSuccess,
    props: true
  },
  {
    path: '/transfer',
    name: 'Transfer',
    component: Transfer,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/delegation',
    name: 'Delegation',
    component: Delegation,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/exchange',
    name: 'Exchange',
    component: Exchange,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/contract',
    name: 'Contract',
    component: Contract,
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/bpvote',
    name: 'BpVote',
    component: BpVote,
    meta: {
      requireAuth: true
    }
  }
]

if (process.env.VUE_APP_FAUCET) {
  routes.push({
    path: '/faucet',
    name: 'Faucet',
    component: Faucet,
    meta: {
      requireAuth: true
    }
  })
}

export default new Router({
  routes
})
