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

// request.debug = true;

let app = koa();

let config = {
  port: 9081
};

function isFileReq(mtype){
  if(
    mtype.indexOf('image/') >= 0 ||
    mtype.indexOf('video/') >= 0
   ){
    return true;
  }
  return false;
}

let readFile = promisify(fs.readFile);

function* serveFile(ctx, targetUrl){
  // targetUrl = 'https://66.media.tumblr.com/a5e242a0bef74a14c6afd14a4aa1fbba/tumblr_od9q1lTJeL1r0ntu4o1_1280.jpg';
  let fileInfo = yield util.getFileWithCache(targetUrl);
  // console.log(fileInfo);
  // ctx.set('x-serve-from', fileInfo.from);
  ctx.type = path.extname(fileInfo.path);
  ctx.body = fs.createReadStream(fileInfo.path);

  // ctx.type = '.jpg';
  // ctx.body = fs.createReadStream('/chenllos/h_proxy/caches/5747e1ad6be1a99f48758a41124bb037.jpg');
  
  // ctx.type = '.jpg';
  // ctx.body = fs.createReadStream('/chenllos/h_proxy/caches/5747e1ad6be1a99f48758a41124bb037.jpg');
  // ctx.body = yield readFile('/chenllos/h_proxy/caches/5747e1ad6be1a99f48758a41124bb037.jpg', 'base64');
}

// 解析 oauth 数据
let parseOauth = (oauthInfoStr) => {
  return JSON.parse(oauthInfoStr);
}

app.use(function*(){
  let targetUrl;
  // 从 header 获取 proxy 目标
  let targetHost = this.get('x-proxy-dist');
  if(targetHost){
    let urlObj = url.parse(this.href);
    targetUrl = targetHost + urlObj.path;
  }
  else{
    targetUrl = decodeURIComponent( this.query.proxy_dest );
  }
  targetUrl = util.decrypt(targetUrl);

  if(this.method === 'GET'){
    console.log('GET something');
    // serve file
    let mType = mime.lookup(targetUrl);
    console.log('mime type:', targetUrl, mType);
    if(isFileReq(mType)){
      console.log('serving files');
      yield serveFile(this, targetUrl);
      
      return;
    }

    // console.log(this.get('Authorization'));
    // console.log(this.request.type);
    let oauthStr = this.get('passed-oauth');
    let reqOpt = {
      url: targetUrl,
      // json: true,
      // followRedirect: false,
      headers: {
        'User-Agent': this.get('User-Agent'),
      }
    };
    if(oauthStr){
      reqOpt.oauth = parseOauth(oauthStr);
    }
    else{
      return this.body = 'should be file request or api req with oauth';
    }
    let rs = request.get(reqOpt);
    rs.on('data', (d) => {
      console.log(d.toString());
    });
    rs.on('close', () => {
      console.log('request read stream closed');
    });
    this.body = rs;
  }
  else{
    this.body = 'non get method is not supported yet';
  }
});

app.listen(config.port, () => {
  console.log('proxy server started!');
});
