'use strict';

var Server = require('../lib/server');

var server = new Server({
  amqpURL: 'amqp://guest:guest@localhost:5672'
});
server.addMethods({
  sum: function(a, b, cb) {
    cb(a + b);
  }
});