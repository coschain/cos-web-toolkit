const koaRouter = require('koa-router');
const router = koaRouter();
const rpc = require('./rpc')

router.post('/create_account', async (ctx, next) => {
  let username = ctx.request.body.username;
  let pubkey = ctx.request.body.pubkey;
  // await c.crypto.createAccount(username, pubkey)
  // let priv = cos.crypto.generatePrivKey()
  // console.log(username, pubkey)
  // console.log(priv.toWIF())
  // let request = new cos.grpc.grpc_type.GetAccountByNameRequest();
  // console.log(request)
  let r = await rpc.getAccountByName('initminer')
  console.log(r)
});

module.exports = function () {
  return router.routes();
};
