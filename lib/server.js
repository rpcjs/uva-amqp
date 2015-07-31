'use strict';

var Transport = require('./transport');
var UvaServer = require('uva').Server;

function Server(opts) {
  var transport = new Transport(opts);
  UvaServer.call(this, transport, opts);
}

Server.prototype = UvaServer.prototype;

module.exports = Server;
