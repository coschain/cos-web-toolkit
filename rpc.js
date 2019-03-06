const sdk = require("cos-grpc-js");
const grpc = require("@improbable-eng/grpc-web").grpc;
const NodeHttpTransport = require("@improbable-eng/grpc-web-node-http-transport")
  .NodeHttpTransport;

grpc.setDefaultTransport(NodeHttpTransport());
// const

let account_name = sdk.raw_type.account_name;
let coin = sdk.raw_type.coin;
let GetAccountByNameRequest = sdk.grpc.GetAccountByNameRequest;
let ApiService = sdk.grpc_service.ApiService;

let host = "http://localhost:8080";

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
          resolve(message.toObject())
        } else {
          resolve({});
        }
      }
    })
  );
};

exports.createAccount = async function(name, pubkey) {
  const creatorPriv = sdk.crypto.privKeyFromWIF(
    "4DjYx2KAGh1NP3dai7MZTLUBMMhMBPmwouKE8jhVSESywccpVZ"
  );
  if (creatorPriv === null) {
    console.log("creator priv from wif failed");
    return;
  }
  const pub = sdk.crypto.pubKeyFromWIF(pubkey);
  if (pub === null) {
    console.log("generate pub from priv failed");
    return;
  }
  const auth = new sdk.raw_type.authority();
  // auth.setWeightThreshold(1);
  // const kauth = new sdk.raw_type.kv_key_auth();
  const pubkeyType = new sdk.raw_type.public_key_type();
  pubkeyType.setData(pub.data);
  // kauth.setKey(pubkeyType);
  // kauth.setWeight(1);
  // auth.addKeyAuths(kauth);
  auth.setKey(pubkeyType)
  const acop = new sdk.operation.account_create_operation();
  const c = new sdk.raw_type.coin();
  c.setValue(1);
  acop.setFee(c);
  const creator = new account_name();
  creator.setValue("initminer");
  acop.setCreator(creator);
  const an = new account_name();
  an.setValue(name);
  acop.setNewAccountName(an);
  acop.setOwner(auth);
  const signTx = await signOps(creatorPriv, [acop]);
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
          resolve({});
        }
      }
    })
  );
};

exports.transfer = async function(sender, receiver, amount, memo, privkey) {
  const senderPriv = sdk.crypto.privKeyFromWIF(
    privkey
  );
  if (senderPriv === null) {
    console.log("sender priv from wif failed");
    return;
  }
  const top = new sdk.operation.transfer_operation();
  const fromAccount = new account_name();
  fromAccount.setValue(sender);
  top.setFrom(fromAccount);
  const toAccount = new account_name();
  toAccount.setValue(receiver);
  top.setTo(toAccount)
  const sendAmount = new coin();
  sendAmount.setValue(amount);
  top.setAmount(sendAmount)
  const signTx = await signOps(senderPriv, [top]);
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
          console.log(message.toObject())
          resolve(message.toObject());
        } else {
          resolve({});
        }
      }
    })
  );
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
          let s = signTx.sign(privKey);
          signature.setSig(s);
          signTx.setSignature(signature);
          // skip validate
          resolve(signTx);
        } else {
          resolve({});
        }
      }
    })
  );
};
