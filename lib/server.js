'use strict';

var Transport = require('./transport');
var UvaServer = require('uva').Server;

function Server(opts) {
  opts.role = 'server';
  var transport = new Transport(opts);
  UvaServer.call(this, transport, opts);
}

Server.prototype = UvaServer.prototype;

module.exports = Server;
