const koaRouter = require('koa-router');
const cos = require('cos-grpc-js')
const router = koaRouter();

router.post('/create_account', async (ctx, next) => {
  let username = ctx.request.body.username;
  let pubkey = ctx.request.body.pubkey;
  // await c.crypto.createAccount(username, pubkey)
  let priv = cos.crypto.generatePrivKey()
  // console.log(username, pubkey)
  console.log(priv.toWIF())
});

module.exports = function () {
  return router.routes();
};
