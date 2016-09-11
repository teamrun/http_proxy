const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const url = require('url');

const request = require('request');
const promisify = require('es6-promisify');

let accessFile = promisify(fs.access);

let md5 = (str) => {
  let md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

function makeLocalCachePath(_url){
  _url = decodeURIComponent(_url);
  let extName = path.extname(url.parse(_url).pathname);
  // return config.localMediaCache + '/' + md5(_url) + extName;
  return __dirname + '/caches/' + md5(_url) + extName;
}

function saveRemoteFile(fileUrl, savePath){
  return new Promise((resolve, reject) => {
    console.log('save remote file:', fileUrl, savePath);
    let ws = fs.createWriteStream(savePath);
    let rs = request.get(fileUrl);
    rs.pipe(ws);
    ws.on('finish', () => {
      console.log('ws finish');
      resolve();
    });
    ws.on('error', reject);
  });
}

let getFileWithCache = function*(fileUrl){
  let _from;
  let expectPath = makeLocalCachePath(fileUrl);
  console.log('expectPath', expectPath)
  // 本地是否有缓存文件
  let fileExists;
  try{
    yield accessFile(expectPath);
    fileExists = true;
  }
  catch(err){
    fileExists = false;
  }
  console.log('file exists:', fileExists);
  // 从本地读取
  if(fileExists){
    _from = 'cache';
    // this.set('x-serve-from', 'local');
    // this.set('content-type', mime.lookup(expectPath));

    // this.body = fs.createReadStream(expectPath);
  }
  // 从 remtoe 读取
  else{
    _from = 'remote';
    yield saveRemoteFile(fileUrl, expectPath);
  }
  return {path: expectPath, from: _from};
}


let encrypt = (str) => {
  let base64 = (new Buffer(str)).toString('base64');
  return base64.split('').reverse().join('');
}

let decrypt = (str) => {
  let base64 = str.split('').reverse().join('');
  return (new Buffer(base64, 'base64')).toString();
}

module.exports = {
  getFileWithCache,
  encrypt,
  decrypt
};