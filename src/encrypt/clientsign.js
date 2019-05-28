/* eslint-disable no-unused-vars,no-undef */
import crc32 from 'crc/crc32'
const sdk = require('cos-grpc-js')
const grpc = require('@improbable-eng/grpc-web').grpc
const bigInt = require('big-integer')

let AccountName = sdk.raw_type.account_name
let TransferOperation = sdk.operation.transfer_operation
let TransferToVestingOperation = sdk.operation.transfer_to_vesting_operation
let PostOperation = sdk.operation.post_operation
let Coin = sdk.raw_type.coin
let Transaction = sdk.transaction.transaction
let SignedTransaction = sdk.transaction.signed_transaction
let TimePoint = sdk.raw_type.time_point_sec
let Signature = sdk.raw_type.signature_type
let Beneficiary = sdk.raw_type.beneficiary_route_type

let ApiService = sdk.grpc_service.ApiService

let host = process.env.VUE_APP_CHAIN

export const transfer = async function (sender, receiver, amount, memo, privkey) {
  const senderPriv = sdk.crypto.privKeyFromWIF(
    privkey
  )
  if (senderPriv === null) {
    console.log('sender priv from wif failed')
    return
  }
  let [integer, decimal] = amount.split('.')
  let value = bigInt(integer)
  decimal = '0.' + decimal
  value = value.multiply(bigInt(1000000))
  value = value.add(bigInt(Number(decimal) * 1000000))
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

  const signTx = await signOps(senderPriv, [top])
  let trxId = signTx.id().getHexHash()
  const broadcastTrxRequest = new sdk.grpc.BroadcastTrxRequest()
  // @ts-ignore
  broadcastTrxRequest.setTransaction(signTx)
  return new Promise(resolve =>
    grpc.unary(ApiService.BroadcastTrx, {
      request: broadcastTrxRequest,
      host: host,
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

export const costovesting = async function (account, amount, privkey) {
  const priv = sdk.crypto.privKeyFromWIF(
    privkey
  )
  if (priv === null) {
    console.log('priv from wif failed')
    return
  }
  let [integer, decimal] = amount.split('.')
  let value = bigInt(integer)
  decimal = '0.' + decimal
  value = value.multiply(bigInt(1000000))
  value = value.add(bigInt(Number(decimal) * 1000000))

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

  const signTx = await signOps(priv, [top])
  let trxId = signTx.id().getHexHash()
  const broadcastTrxRequest = new sdk.grpc.BroadcastTrxRequest()
  // @ts-ignore
  broadcastTrxRequest.setTransaction(signTx)
  return new Promise(resolve =>
    grpc.unary(ApiService.BroadcastTrx, {
      request: broadcastTrxRequest,
      host: host,
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
  const signTx = await signOps(senderPriv, [pop])
  const broadcastTrxRequest = new sdk.grpc.BroadcastTrxRequest()
  // @ts-ignore
  broadcastTrxRequest.setTransaction(signTx)
  return new Promise(resolve =>
    grpc.unary(ApiService.BroadcastTrx, {
      request: broadcastTrxRequest,
      host: host,
      onEnd: res => {
        const { status, statusMessage, headers, message, trailers } = res
        if (status === grpc.Code.OK && message) {
          resolve(message.toObject())
        } else {
          resolve({msg: statusMessage})
        }
      }
    })
  )
}

const generateUUID = (content) => {
  let randContent = content + Math.random() * 1e5
  let c = Math.abs(crc32(randContent))
  // return (bigInt(Date.now()) * BigInt(1e6) + BigInt(c)).toString()
  return bigInt(Date.now()).multiply(bigInt(1e6)).add(bigInt(c)).toString()
}

const signOps = async (privKey, ops) => {
  const tx = new Transaction()
  const nonParamsRequest = new sdk.grpc.NonParamsRequest()
  return new Promise(resolve =>
    grpc.unary(ApiService.GetChainState, {
      request: nonParamsRequest,
      host: host,
      onEnd: res => {
        const { status, statusMessage, headers, message, trailers } = res
        if (status === grpc.Code.OK && message) {
          const chainState = message.toObject()
          // @ts-ignore
          tx.setRefBlockNum(chainState.state.dgpo.headBlockNumber & 0x7ff)
          // @ts-ignore
          tx.setRefBlockPrefix(chainState.state.dgpo.headBlockPrefix)
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
          let s = signTx.sign(privKey)
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
