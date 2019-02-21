const koaRouter = require('koa-router');
const router = koaRouter();

router.get('/generate_keys', async (ctx, next) => {
  // ctx.body = {publicKey: "11111", privateKey: "22222"}

})

module.exports = function () {
  return router.routes();
}
