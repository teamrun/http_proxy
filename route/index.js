'use strict';
const Router = require('koa-router');
const imgRoute = require('./illu.js');
const apiRoute = require('./api.js');

let router = new Router();

imgRoute(router);
apiRoute(router);

module.exports = (app) => {
  console.log('binding routes');
  app.use(router.routes());
}
