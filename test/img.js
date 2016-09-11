'use strict';
const expect = require('expect.js');
const request = require('request');

const fs = require('fs');
const util = require('../util.js');


// const proxyServer = 'http://127.0.0.1:9081';
const proxyServer = 'http://proxy.chenllos.com';

let imgUrl = 'https://67.media.tumblr.com/f394cc24836f4306a00aa75df688bf93/tumblr_oat9ahc2DI1vnvof4o4_500.jpg';

describe('img route', () => {
  it('should get img', done => {
    let url = `${proxyServer}/illu/${util.encrypt(imgUrl)}`;
    console.log(url);
    let rs = request.get(url, (err, resp, body) => {
      console.log(err? resp : body);
    });
    let ws = fs.createWriteStream('./xx.jpg');
    rs.pipe(ws);
    ws.on('finish', () => {
      console.log('pipe done!');
      done();
    });

  });
});
