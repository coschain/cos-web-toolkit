const sdk = require("cos-grpc-js");
const grpc = require("@improbable-eng/grpc-web").grpc;
const NodeHttpTransport = require("@improbable-eng/grpc-web-node-http-transport")
  .NodeHttpTransport;

grpc.setDefaultTransport(NodeHttpTransport());
// const

let account_name = sdk.raw_type.account_name;
let GetAccountByNameRequest = sdk.grpc.GetAccountByNameRequest;
let ApiService = sdk.grpc_service.ApiService;
let TransferOperation = sdk.operation.transfer_operation
let AccountName = sdk.raw_type.account_name
let Coin = sdk.raw_type.coin
let ChainId = sdk.raw_type.chain_id

let chainid = new ChainId()
chainid.setChainEnv('test')

// let host = constant.host
let host = process.env.CHAIN

exports.getAccountByName = async function(name) {
  const getAccountByNameRequest = new GetAccountByNameRequest();
  const accountName = new account_name();
  accountName.setValue(name);
  getAccountByNameRequest.setAccountName(accountName);
  return new Promise(resolve =>
    grpc.unary(ApiService.GetAccountByName, {
      request: getAccountByNameRequest,
      host: host,
      onEnd: res => {
        const { status, statusMessage, headers, message, trailers } = res;
        if (status === grpc.Code.OK && message) {
          let object = message.toObject();
          object.info.publicKey = message.getInfo().getPublicKey().toWIF();
          resolve(object);
        } else {
          resolve({});
        }
      }
    })
  );
};

exports.chainInfo = async function() {
  const nonParamsRequest = new sdk.grpc.NonParamsRequest();
  return new Promise(resolve =>
    grpc.unary(ApiService.GetChainState, {
      request: nonParamsRequest,
      host: host,
      onEnd: res => {
        const { status, statusMessage, headers, message, trailers } = res;
        if (status === grpc.Code.OK && message) {
          const chainState = message.toObject();
          resolve(chainState);
        } else {
          resolve({});
        }
      }
    })
  );
};

// the user accountcreator is the root creator.
exports.createAccount = async function(name, pubkey) {
  let CREATOR = process.env.CREATOR;
  if (CREATOR === null){
    console.log("Your need to set an CREATOR private key in environment variable");
    return
  }
  const creatorPriv = sdk.crypto.privKeyFromWIF(CREATOR);
  if (creatorPriv === null) {
    console.log("creator priv from wif failed");
    return;
  }
  const pub = sdk.crypto.pubKeyFromWIF(pubkey);
  if (pub === null) {
    console.log("generate pub from priv failed");
    return;
  }
  const pubkeyType = new sdk.raw_type.public_key_type();
  pubkeyType.setData(pub.data);
  const acop = new sdk.operation.account_create_operation();
  const c = new sdk.raw_type.coin();
  c.setValue('1');
  acop.setFee(c);
  const creator = new account_name();
  creator.setValue("accountcreator");
  acop.setCreator(creator);
  const an = new account_name();
  an.setValue(name);
  acop.setNewAccountName(an);
  acop.setOwner(pubkeyType);
  const signTx = await signOps(creatorPriv, [acop], chainid);
  const broadcastTrxRequest = new sdk.grpc.BroadcastTrxRequest();
  // @ts-ignore
  broadcastTrxRequest.setTransaction(signTx);
  return new Promise(resolve =>
    grpc.unary(ApiService.BroadcastTrx, {
      request: broadcastTrxRequest,
      host: host,
      onEnd: res => {
        const { status, statusMessage, headers, message, trailers } = res;
        if (status === grpc.Code.OK && message) {
          resolve(message.toObject());
        } else {
          resolve({msg: statusMessage});
        }
      }
    })
  );
};

exports.dripOneCOS = async function (name) {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  let CREATOR = process.env.CREATOR;
  if (CREATOR === null){
    console.log("Your need to set an CREATOR private key in environment variable");
    return
  }
  const creatorPriv = sdk.crypto.privKeyFromWIF(CREATOR);
  if (creatorPriv === null) {
    console.log("creator priv from wif failed");
    return;
  }
  const top = new TransferOperation();
  const fromAccount = new AccountName();
  fromAccount.setValue('accountcreator');
  top.setFrom(fromAccount);
  const toAccount = new AccountName();
  toAccount.setValue(name);
  top.setTo(toAccount);
  const sendAmount = new Coin();
  // 1 cos, precision 6
  sendAmount.setValue('1000000');
  top.setAmount(sendAmount);
  const signTx = await signOps(creatorPriv, [top], chainid);
  const broadcastTrxRequest = new sdk.grpc.BroadcastTrxRequest();
  // @ts-ignore
  broadcastTrxRequest.setTransaction(signTx);
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
};

const signOps = async (privKey, ops) => {
  const tx = new sdk.transaction.transaction();
  const nonParamsRequest = new sdk.grpc.NonParamsRequest();
  return new Promise(resolve =>
    grpc.unary(ApiService.GetChainState, {
      request: nonParamsRequest,
      host: host,
      onEnd: res => {
        const { status, statusMessage, headers, message, trailers } = res;
        if (status === grpc.Code.OK && message) {
          const chainState = message.toObject();
          // @ts-ignore
          tx.setRefBlockNum(chainState.state.dgpo.headBlockNumber & 0x7ff);
          // @ts-ignore
          tx.setRefBlockPrefix(chainState.state.dgpo.headBlockPrefix);
          // @ts-ignore
          const expiration = new sdk.raw_type.time_point_sec();
          // @ts-ignore
          expiration.setUtcSeconds(chainState.state.dgpo.time.utcSeconds + 30);
          tx.setExpiration(expiration);
          for (let op of ops) {
            tx.addOperation(op);
          }
          const signTx = new sdk.transaction.signed_transaction();
          signTx.setTrx(tx);
          // const signature = privKey.
          const signature = new sdk.raw_type.signature_type();
          let s = signTx.sign(privKey, chainid);
          signature.setSig(s);
          signTx.setSignature(signature);
          // skip validate
          resolve(signTx);
        } else {
          resolve({msg: statusMessage});
        }
      }
    })
  );
};
