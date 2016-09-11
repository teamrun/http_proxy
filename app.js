'use strict';

const koa = require('koa');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const url = require('url');

const promisify = require('es6-promisify');
const request = require('request');
const mime = require('mime');

const util = require('./util');
const route = require('./route/index.js');

// request.debug = true;

let app = koa();

let config = {
  port: 9081
};

route(app);

app.listen(config.port, () => {
  console.log('proxy server started!');
});
