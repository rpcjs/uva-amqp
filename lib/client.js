'use strict';

var Transport = require('./transport');
var UvaClient = require('uva').Client;

function Client(opts) {
  var transport = new Transport(opts);
  UvaClient.call(this, transport, opts);
}

Client.prototype = UvaClient.prototype;

module.exports = Client;
