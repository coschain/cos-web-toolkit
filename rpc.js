const sdk = require('cos-grpc-js')
const grpc = require("@improbable-eng/grpc-web").grpc
const NodeHttpTransport = require('@improbable-eng/grpc-web-node-http-transport').NodeHttpTransport;

grpc.setDefaultTransport(NodeHttpTransport());
// const


let account_name = sdk.type.raw_type.account_name;
let GetAccountByNameRequest = sdk.g.grpc_type.GetAccountByNameRequest;
let ApiService = sdk.g.grpc_service.ApiService;
// let grpc = sdk.g.grpc;

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
          resolve(message.toObject())
        } else {
          resolve({})
        }
      }
    })
  );
}

exports.getAccountByName = getAccountByName;
