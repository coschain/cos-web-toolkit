/* eslint-disable no-unused-vars */
const sdk = require('cos-grpc-js')
const grpc = require('@improbable-eng/grpc-web').grpc

let AccountName = sdk.raw_type.account_name
let TransferOperation = sdk.operation.transfer_operation
let Coin = sdk.raw_type.coin
let Transaction = sdk.transaction.transaction
let SignedTransaction = sdk.transaction.signed_transaction
let TimePoint = sdk.raw_type.time_point_sec
let Signature = sdk.raw_type.signature_type

let ApiService = sdk.grpc_service.ApiService

let host = 'http://localhost:8080'

export const transfer = async function (sender, receiver, amount, memo, privkey) {
  const senderPriv = sdk.crypto.privKeyFromWIF(
    privkey
  )
  if (senderPriv === null) {
    console.log('sender priv from wif failed')
    return
  }
  const top = new TransferOperation()
  const fromAccount = new AccountName()
  fromAccount.setValue(sender)
  top.setFrom(fromAccount)
  const toAccount = new AccountName()
  toAccount.setValue(receiver)
  top.setTo(toAccount)
  const sendAmount = new Coin()
  sendAmount.setValue(amount)
  top.setAmount(sendAmount)
  const signTx = await signOps(senderPriv, [top])
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
          resolve({})
        }
      }
    })
  )
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
          resolve({})
        }
      }
    })
  )
}