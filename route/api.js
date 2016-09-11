
// 解析 oauth 数据
let parseOauth = (oauthInfoStr) => {
  return JSON.parse(oauthInfoStr);
}


'use strict';
const fs = require('fs');
const path = require('path');
const url = require('url');

const _ = require('lodash');
const request = require('request');

const util = require('../util.js');
// route for img and video

let getTargrtUrl = (ctx) => {
  let targetUrl;
  // 从 header 获取 proxy 目标
  targetUrl = ctx.get('x-proxy-dest');
  if(!targetUrl){
    targetUrl = decodeURIComponent( ctx.query.proxy_dest );
  }
  console.log('raw target:', targetUrl);
  targetUrl = util.decrypt(targetUrl);
  console.log('parsed:', targetUrl);
  return targetUrl;
}

function* apiRoute(next){
  let targetUrl = getTargrtUrl(this);
  let oauthStr = this.get('x-passed-oauth');
  let reqOpt = {
    url: targetUrl,
    json: true,
    followRedirect: false,
    headers: {
      'User-Agent': this.get('User-Agent'),
    }
  };
  if(oauthStr){
    reqOpt.oauth = parseOauth(oauthStr);
  }
  else{
    return this.body = 'api req should be with oauth';
  }
  let rs = request.get(reqOpt);
  this.body = rs;
};

module.exports = (router) => {
  router.get('/api', apiRoute);
}
