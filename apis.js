const koaRouter = require('koa-router');
const router = koaRouter();
const rpc = require('./rpc')

router.post('/create_account', async (ctx, next) => {
  let username = ctx.request.body.username;
  let pubkey = ctx.request.body.pubkey;
  let r = await rpc.createAccount(username, pubkey)
  if (r.invoice.status === 200) {
    ctx.body = {"success": true}
  } else {
    ctx.body = {"success": false}
  }
});

module.exports = function () {
  return router.routes();
};
