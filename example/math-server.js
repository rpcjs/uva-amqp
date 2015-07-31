'use strict';

var Server = require('../lib/server');

var server = new Server({
  channel: 'math'
});
server.addMethods({
  sum: function(a, b, cb) {
    cb(a + b);
  }
});
