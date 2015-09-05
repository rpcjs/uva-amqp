'use strict';

var util = require('util');
var amqpRpc = require('amqp-rpc');
var debug = require('debug')('uva-amqp');

function Client(opts) {
  opts = opts || {};
  if (!opts.amqpURL) {
    throw new TypeError('amqpURL is missing from the opts');
  }
  this.methods = {};

  this._rpc = amqpRpc.factory({
    url: opts._amqpURL
  });
}

Client.prototype.call = function(methodName) {
  var args = [];
  var i = 0;
  var cb;

  if (!methodName) {
    throw new TypeError('call requires a methodName');
  }
  if (typeof methodName !== 'string') {
    throw new TypeError('call requires a methodName of string type');
  }

  while (typeof arguments[++i] !== 'function' && i < arguments.length) {
    args.push(arguments[i]);
  }

  if (typeof arguments[i] === 'function') {
    cb = arguments[i];
  }

  debug('calling %s with args %j', methodName, args);
  this._rpc.call(methodName, args, cb);
};

Client.prototype._createMethod = function(methodName) {
  return function() {
    var args = [methodName].concat(Array.prototype.slice.call(arguments));
    this.call.apply(this, args);
  }.bind(this);
};

Client.prototype.register = function(methods) {
  if (!(methods instanceof Array)) {
    methods = [methods];
  }
  methods.forEach(function(method) {
    if (typeof this.methods[method] === 'undefined') {
      this.methods[method] = this._createMethod(method);
    }
  }.bind(this));
};

module.exports = Client;
