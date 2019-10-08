const Koa = require('koa');
const Json = require('koa-json');
const Logger = require('koa-logger');
const KoaRouter = require('koa-router');
const koaBodyParser = require('koa-bodyparser');
const Serve = require('koa-static');
const Cors = require('koa2-cors');
const path = require('path');
const api = require('./apis');

const app = new Koa();
const router = KoaRouter();
app.proxy = true;

app.use(Json());
app.use(Logger());
app.use(Cors());

router.use('/v1', api());

app.use(koaBodyParser());
app.use(router.routes());
app.use(Serve(path.resolve('dist')));

app.listen(3000, 'localhost', () => {
  console.log(`Koa is listening in 3000`);
});
