/* eslint-disable no-unused-vars,no-undef */

const Cos = require('@coschain/cosjs')

const HOST = process.env.VUE_APP_CHAIN

function getChainId () {
  switch (process.env.NODE_ENV) {
    case 'development':
      return 'main'
    case 'testing':
      return 'test'
    case 'production':
      return 'main'
    default:
      return 'main'
  }
}

const cos = new Cos(getChainId(), HOST)

export const accountInfo = async function (name) {
  return cos.wallet.accountInfo(name)
}

export const bpInfo = async function (bp) {
  return cos.wallet.bpInfo(bp)
}

export const transfer = async function (sender, receiver, amount, memo, privkey) {
  cos.wallet.addAccount(sender, privkey)
  return cos.wallet.transfer(sender, receiver, amount, memo)
}

export const accountupdate = async function (account, newPubKey, privkey) {
  cos.wallet.addAccount(sender, privkey)
  return cos.wallet.accountUpdate(account, newPubKey)
}

export const costovesting = async function (account, amount, privkey) {
  cos.wallet.addAccount(account, privkey)
  return cos.wallet.cosToVest(account, amount)
}

export const vestingtocos = async function (account, amount, privkey) {
  cos.wallet.addAccount(account, privkey)
  try {
    const r = await cos.wallet.vestToCos(account, amount)
    return r
  } catch (e) {
    alert(e)
  }
}

export const costostake = async function (account, amount, privkey, toaccount) {
  cos.wallet.addAccount(account, privkey)
  return cos.wallet.cosToStake(account, amount, toaccount)
}

export const staketocos = async function (account, amount, privkey, toaccount) {
  cos.wallet.addAccount(account, privkey)
  return cos.wallet.stakeToCos(account, amount, toaccount)
}

export const post = async function (sender, title, content, tagsStr, privkey) {
  return {'msg': 'wallet do not post anything'}
}

export const contractcall = async function (caller, owner, contract, method, args, privkey, payment) {
  cos.wallet.addAccount(caller, privkey)
  return cos.wallet.contractCall(caller, owner, contract, method, args, payment)
}

export const getBlockProducerList = async function (start, limit, lastBlockProducer) {
  return cos.wallet.blockProducerList(start, limit, lastBlockProducer)
}

export const voteToBlockProducer = async function (voter, bp, cancel, privkey) {
  cos.wallet.addAccount(voter, privkey)
  return cos.wallet.voteToBlockProducer(voter, bp, cancel)
}
