'use strict';

const Server = require('../lib/server');

let server = new Server({
  channel: 'math',
  url: 'amqp://guest:guest@localhost:5672',
});
server.addMethods({
  sum: function(a, b, cb) {
    cb(null, a + b);
  },
});
