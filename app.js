const Koa = require("koa");
const json = require('koa-json');
const logger = require('koa-logger');
const koaRouter = require('koa-router');
const koaBodyparser = require('koa-bodyparser');
const serve = require('koa-static');
var cors = require('koa2-cors');
const path = require('path');
const api = require('./apis')

const app = new Koa();
const router = koaRouter();

app.use(koaBodyparser());
app.use(json());
app.use(logger());
app.use(cors());

app.use(async function (ctx, next) {
  let start = new Date();
  await next();
  let ms = new Date() - start;
  console.log('%s %s - %s', ctx.method, ctx.url, ms);
});


router.use('/api', api());

app.use(router.routes());
app.use(serve(path.resolve('dist')));

app.listen(3000, () => {
  console.log(`Koa is listening in 3000`);
});
