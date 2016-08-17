'use strict';

let expect = require('expect.js');
let request = require('request');

const proxyServer = 'http://127.0.0.1:9081';

describe('be able to proxy by header', () => {
  it('should get chenllos.com', (done) => {
    request.get({
      url: proxyServer + '/',
      headers: {
        'x-proxy-dist': 'http://chenllos.com'
      }
    }, (err, resp, body) => {
      expect(err).to.be(null);
      // console.log(body);
      expect(body.indexOf('Welcome to nginx!')).to.be.above(-1);
      done();
    });
  });


  it('should get local real server', (done) => {
    request.get({
      url: proxyServer + '?proxy_dist=' + 'http://chenllos.com'
    }, (err, resp, body) => {
      expect(err).to.be(null);
      // console.log(body);
      expect(body.indexOf('Welcome to nginx!')).to.be.above(-1);
      done();
    });
  });

});
