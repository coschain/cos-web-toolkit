const sdk = require('cos-grpc-js')
const grpc = require("@improbable-eng/grpc-web").grpc
const NodeHttpTransport = require('@improbable-eng/grpc-web-node-http-transport').NodeHttpTransport;

grpc.setDefaultTransport(NodeHttpTransport());
// const


let account_name = sdk.type.raw_type.account_name;
let GetAccountByNameRequest = sdk.grpc.grpc_type.GetAccountByNameRequest;
let AccountResponse = sdk.grpc.grpc_type.AccountResponse;
let ApiService = sdk.grpc.grpc_service.ApiService;

let host = "http://localhost:8080";

async function getAccountByName(name){
  const getAccountByNameRequest= new GetAccountByNameRequest();
  const accountName = new account_name();
  accountName.setValue(name);
  getAccountByNameRequest.setAccountName(accountName);
  return new Promise(
    resolve  => grpc.unary(ApiService.GetAccountByName, {
      request: getAccountByNameRequest,
      host: host,
      onEnd: res => {
        const {status, statusMessage, headers, message, trailers} = res;
        if (status === grpc.Code.OK && message) {
          // resolve(message.toObject())
          let a  = message.getAccountName()
          // console.log(a.toObject())
          // resolve(message.toObject())
          // a.validate()
          console.log(a instanceof account_name)
          console.log(a.validate())
          resolve({})
        } else {
          resolve({})
        }
      }
    })
  );
}

exports.getAccountByName = getAccountByName;
