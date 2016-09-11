'use strict';
const path = require('path');
const fs = require('fs');
const util = require('../util.js');
const _ = require('lodash');
// route for img and video

function* imgRoute(next){
  let imgCode = this.params.imgcode;
  let imgUrl = util.decrypt(imgCode);

  let fileInfo = yield util.getFileWithCache(imgUrl);
  console.log(_.pick(fileInfo, 'path', 'from'));
  this.set('x-serve-from', fileInfo.from);
  this.type = path.extname(fileInfo.path);
  this.body = fileInfo.rs;
};

module.exports = (router) => {
  router.get('/illu/:imgcode', imgRoute);
}
