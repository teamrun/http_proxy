'use strict';

const koa = require('koa');
const url = require('url');
const request = require('request');

let app = koa();

let config = {
  port: 9081
};

app.use(function*(){
  let targetUrl;
  // 从 header 获取 proxy 目标
  let targetHost = this.get('x-proxy-dist');
  if(targetHost){
    let urlObj = url.parse(this.href);
    targetUrl = targetHost + urlObj.path;
  }
  else{
    targetUrl = decodeURIComponent( this.query.proxy_dist );
  }

  // pipe proxy
  this.body = this.req.pipe(request(targetUrl));
});

app.listen(config.port, () => {
  console.log('proxy server started!');
});
