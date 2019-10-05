const koaRouter = require('koa-router');
const router = koaRouter();
const rpc = require('./rpc');

router.post('/account', async (ctx, next) => {
  let name = ctx.request.body.name;
  ctx.body = await rpc.getAccountByName(name)
});

router.post('/create_account', async (ctx, next) => {
  // let username = ctx.request.body.username.toLowerCase();
  // let pubkey = ctx.request.body.pubkey;
  // let r = await rpc.createAccount(username, pubkey);
  // if (r.invoice.status === 200) {
  //   ctx.body = {"success": true}
  // } else {
  //   ctx.body = {"success": false}
  // }
  ctx.body = {"success": false, "msg": "stop to create accounts"}
});

router.post('/drip', async (ctx, next) => {
  if (process.env.NODE_ENV === 'production') {
    ctx.body = {"success": false, "msg": "faucet only works in development or testing environment"}
  } else {
    let username = ctx.request.body.username.toLowerCase();
    let r = await rpc.dripOneCOS(username);
    if (r.invoice && r.invoice.status === 200) {
      ctx.body = {"success": true, "msg": "success"}
    } else {
      ctx.body = {"success": false, "msg": "drip failed"}
    }
  }
});

router.get('/chaininfo', async(ctx, next) => {
  ctx.body = await rpc.chainInfo();
});

module.exports = function () {
  return router.routes();
};
