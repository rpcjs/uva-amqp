'use strict';

var Server = require('../lib/server');

var server = new Server({
  channel: 'math',
  url: 'amqp://guest:guest@localhost:5672'
});
server.addMethods({
  sum: function(a, b, cb) {
    cb(null, a + b);
  }
});
