/* eslint-disable no-unused-vars,no-undef */
const sdk = require('cos-grpc-js')
const grpc = require('@improbable-eng/grpc-web').grpc

const util = require('./util')

let AccountName = sdk.raw_type.account_name
let TransferOperation = sdk.operation.transfer_operation
let TransferToVestingOperation = sdk.operation.transfer_to_vest_operation
let ConvertVestingOperation = sdk.operation.convert_vest_operation
let StakeOperation = sdk.operation.stake_operation
let UnStakeOperation = sdk.operation.un_stake_operation
let PostOperation = sdk.operation.post_operation
let ContractCallOperation = sdk.operation.contract_apply_operation
let Coin = sdk.raw_type.coin
let Vest = sdk.raw_type.vest
let Transaction = sdk.transaction.transaction
let SignedTransaction = sdk.transaction.signed_transaction
let TimePoint = sdk.raw_type.time_point_sec
let Signature = sdk.raw_type.signature_type
let Beneficiary = sdk.raw_type.beneficiary_route_type
let ChainId = sdk.raw_type.chain_id
let BlockProducerRequest = sdk.grpc.GetBlockProducerListByVoteCountRequest
let BpVoteOperation = sdk.operation.bp_vote_operation

let ApiService = sdk.grpc_service.ApiService

const HOST = process.env.VUE_APP_CHAIN

let chainid = new ChainId()
switch (process.env.NODE_ENV) {
  case 'development':
    chainid.setChainEnv('main')
    break
  case 'testing':
    chainid.setChainEnv('test')
    break
  case 'production':
    chainid.setChainEnv('main')
    break
  default:
    chainid.setChainEnv('main')
}

const parseIntoNumber = function (amount) {
  let [integer, decimal] = amount.split('.')
  let value = bigInt(integer)
  decimal = '0.' + decimal
  value = value.multiply(bigInt(1000000))
  value = value.add(bigInt(Number(decimal) * 1000000))
  return value
}

export const transfer = async function (sender, receiver, amount, memo, privkey) {
  const senderPriv = sdk.crypto.privKeyFromWIF(
    privkey
  )
  if (senderPriv === null) {
    console.log('sender priv from wif failed')
    return
  }
  let value = parseIntoNumber(amount)
  const top = new TransferOperation()
  const fromAccount = new AccountName()
  fromAccount.setValue(sender)
  top.setFrom(fromAccount)
  const toAccount = new AccountName()
  toAccount.setValue(receiver)
  top.setTo(toAccount)
  const sendAmount = new Coin()
  sendAmount.setValue(value.toString())
  top.setAmount(sendAmount)
  top.setMemo(memo)

  const signTx = await signOps(senderPriv, [top], chainid)
  return broadcast(signTx)
}

export const costovesting = async function (account, amount, privkey) {
  const priv = sdk.crypto.privKeyFromWIF(
    privkey
  )
  if (priv === null) {
    console.log('priv from wif failed')
    return
  }
  let value = parseIntoNumber(amount)

  const top = new TransferToVestingOperation()
  const fromAccount = new AccountName()
  fromAccount.setValue(account)
  top.setFrom(fromAccount)
  const toAccount = new AccountName()
  toAccount.setValue(account)
  top.setTo(toAccount)
  const sendAmount = new Coin()
  sendAmount.setValue(value.toString())
  top.setAmount(sendAmount)

  const signTx = await signOps(priv, [top], chainid)
  return broadcast(signTx)
}

export const vestingtocos = async function (account, amount, privkey) {
  const priv = sdk.crypto.privKeyFromWIF(
    privkey
  )
  if (priv === null) {
    console.log('priv from wif failed')
    return
  }
  let value = parseIntoNumber(amount)
  if (value.leq(bigInt(1000000))) {
    alert('convert must greater than 1 COS')
    return
  }

  const cop = new ConvertVestingOperation()
  const fromAccount = new AccountName()
  fromAccount.setValue(account)
  cop.setFrom(fromAccount)
  const sendAmount = new Vest()
  sendAmount.setValue(value.toString())
  cop.setAmount(sendAmount)

  const signTx = await signOps(priv, [cop], chainid)
  return broadcast(signTx)
}

export const costostake = async function (account, amount, privkey, toaccount) {
  const priv = sdk.crypto.privKeyFromWIF(
    privkey
  )
  if (priv === null) {
    console.log('priv from wif failed')
    return
  }
  let value = parseIntoNumber(amount)

  const sop = new StakeOperation()
  const stakeFromAccount = new AccountName()
  stakeFromAccount.setValue(account)
  sop.setFrom(stakeFromAccount)
  const stakeToAccount = new AccountName()
  stakeToAccount.setValue(toaccount)
  sop.setTo(stakeToAccount)
  const sendAmount = new Coin()
  sendAmount.setValue(value.toString())
  sop.setAmount(sendAmount)

  const signTx = await signOps(priv, [sop], chainid)
  return broadcast(signTx)
}

export const staketocos = async function (account, amount, privkey, toaccount) {
  const priv = sdk.crypto.privKeyFromWIF(
    privkey
  )
  if (priv === null) {
    console.log('priv from wif failed')
    return
  }
  let value = parseIntoNumber(amount)

  const sop = new UnStakeOperation()
  const stakeFromAccount = new AccountName()
  stakeFromAccount.setValue(account)
  sop.setCreditor(stakeFromAccount)
  const stakeToAccount = new AccountName()
  stakeToAccount.setValue(toaccount)
  sop.setDebtor(stakeToAccount)
  const sendAmount = new Coin()
  sendAmount.setValue(value.toString())
  sop.setAmount(sendAmount)

  const signTx = await signOps(priv, [sop], chainid)
  return broadcast(signTx)
}

export const post = async function (sender, title, content, tagsStr, privkey) {
  const senderPriv = sdk.crypto.privKeyFromWIF(
    privkey
  )
  if (senderPriv === null) {
    console.log('sender priv from wif failed')
    return
  }
  const pop = new PostOperation()
  const senderAccount = new AccountName()
  senderAccount.setValue(sender)
  pop.setUuid(generateUUID(sender + content))
  pop.setOwner(senderAccount)
  pop.setTitle(title)
  pop.setContent(content)
  let beneficiary = new Beneficiary()
  const dappAccount = new AccountName()
  dappAccount.setValue('contentos')
  beneficiary.setName(dappAccount)
  beneficiary.setWeight(10000)
  pop.addBeneficiaries(beneficiary)
  let tags = []
  if (tagsStr.length > 0) {
    for (let s of tagsStr.split(',')) {
      tags.push(s.trim())
    }
  }
  pop.setTagsList(tags)
  const signTx = await signOps(senderPriv, [pop], chainid)
  return broadcast(signTx)
}

export const contractcall = async function (caller, owner, contract, method, args, privkey, payment) {
  const callerPriv = sdk.crypto.privKeyFromWIF(
    privkey
  )
  if (callerPriv === null) {
    console.log('caller priv from wif failed')
    return
  }
  const callOp = new ContractCallOperation()
  const callerAccount = new AccountName()
  const ownerAccount = new AccountName()

  callerAccount.setValue(caller)
  ownerAccount.setValue(owner)
  callOp.setCaller(callerAccount)
  callOp.setOwner(ownerAccount)
  callOp.setContract(contract)
  callOp.setMethod(method)
  callOp.setParams(args)
  let value = parseIntoNumber(payment)
  const paymentCoin = new Coin()
  paymentCoin.setValue(value.toString())
  callOp.setAmount(paymentCoin)

  const signTx = await signOps(callerPriv, [callOp], chainid)
  return broadcast(signTx)
}

export const getBlockProducerList = async function () {
  const blockProducerRequest = new BlockProducerRequest()
  blockProducerRequest.setLimit(30)
  return new Promise(resolve =>
    grpc.unary(ApiService.GetBlockProducerListByVoteCount, {
      request: blockProducerRequest,
      host: HOST,
      onEnd: res => {
        const { status, statusMessage, headers, message, trailers } = res
        if (status === grpc.Code.OK && message) {
          let object = message.toObject()
          resolve(object)
        } else {
          resolve({})
        }
      }
    })
  )
}

export const voteToBlockProducer = async function (voterValue, bpValue, privkeyStr) {
  let privkey = util.parsePrivateKeyWIF(privkeyStr)
  if (!privkey) {
    return
  }
  let bpVoteOp = new BpVoteOperation()
  let bp = new AccountName()
  bp.setValue(bpValue)
  let voter = new AccountName()
  voter.setValue(voterValue)
  bpVoteOp.setVoter(voter)
  bpVoteOp.setBlockProducer(bp)

  const signTx = await signOps(privkey, [bpVoteOp], chainid)
  let trxId = signTx.id().getHexHash()
  return broadcast(signTx, trxId)
}

const signOps = async (privKey, ops, chainid) => {
  const tx = new Transaction()
  const nonParamsRequest = new sdk.grpc.NonParamsRequest()
  return new Promise(resolve =>
    grpc.unary(ApiService.GetChainState, {
      request: nonParamsRequest,
      host: HOST,
      onEnd: res => {
        const { status, statusMessage, headers, message, trailers } = res
        if (status === grpc.Code.OK && message) {
          const chainState = message.toObject()
          // @ts-ignore
          tx.setRefBlockNum(chainState.state.dgpo.headBlockNumber & 0x7ff)
          // @ts-ignore
          let buffer = Buffer.from(chainState.state.dgpo.headBlockId.hash.toString(), 'base64')
          tx.setRefBlockPrefix(util.bytes2BigEndUint32(buffer.slice(8, 12)))
          // @ts-ignore
          const expiration = new TimePoint()
          // @ts-ignore
          expiration.setUtcSeconds(chainState.state.dgpo.time.utcSeconds + 30)
          tx.setExpiration(expiration)
          for (let op of ops) {
            tx.addOperation(op)
          }
          const signTx = new SignedTransaction()
          signTx.setTrx(tx)
          // const signature = privKey.
          const signature = new Signature()
          let s = signTx.sign(privKey, chainid)
          signature.setSig(s)
          signTx.setSignature(signature)
          // skip validate
          resolve(signTx)
        } else {
          resolve({msg: statusMessage})
        }
      }
    })
  )
}

const broadcast = function (signTx) {
  let trxId = signTx.id().getHexHash()
  const broadcastTrxRequest = new sdk.grpc.BroadcastTrxRequest()
  // @ts-ignore
  broadcastTrxRequest.setTransaction(signTx)
  return new Promise(resolve =>
    grpc.unary(ApiService.BroadcastTrx, {
      request: broadcastTrxRequest,
      host: HOST,
      onEnd: res => {
        const { status, statusMessage, headers, message, trailers } = res
        if (status === grpc.Code.OK && message) {
          let obj = message.toObject()
          obj.invoice.trxId = trxId
          resolve(obj)
        } else {
          resolve({msg: statusMessage})
        }
      }
    })
  )
}
