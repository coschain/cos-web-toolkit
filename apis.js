const koaRouter = require('koa-router');
const router = koaRouter();
const rpc = require('./rpc')

router.post('/account', async (ctx, next) => {
  let name = ctx.request.body.name;
  ctx.body = await rpc.getAccountByName(name)
});

router.post('/create_account', async (ctx, next) => {
  let username = ctx.request.body.username;
  let pubkey = ctx.request.body.pubkey;
  let r = await rpc.createAccount(username, pubkey);
  if (r.invoice.status === 200) {
    ctx.body = {"success": true}
  } else {
    ctx.body = {"success": false}
  }
});

router.post('/transfer', async (ctx, next) => {
  let sender = ctx.request.body.sender;
  let receiver = ctx.request.body.receiver;
  let amount = ctx.request.body.amount;
  let memo = ctx.request.body.memo;
  // ???
  let priv = ctx.request.body.privKey;
  let r = await rpc.transfer(sender, receiver, amount, memo, priv);
  console.log(r)
});

module.exports = function () {
  return router.routes();
};
