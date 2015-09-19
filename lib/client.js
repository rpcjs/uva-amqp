'use strict';

var util = require('util');
var amqpRpc = require('amqp-rpc');
var debug = require('debug')('uva-amqp');

function Client(opts) {
  opts = opts || {};
  if (!opts.url) {
    throw new TypeError('url is missing from the opts');
  }
  if (!opts.channel) {
    throw new TypeError('channel is missing from the opts');
  }
  this._channel = opts.channel;
  this.methods = {};

  this._rpc = amqpRpc.factory({
    url: opts.url
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

  /* return a promise if no callback was passed */
  var promise;
  if (typeof cb === 'undefined') {
    promise = new Promise(function(fulfill, reject) {
      cb = function(err) {
        if (typeof err !== 'undefined' && err !== null) {
          reject(err);
          return;
        }
        var args = argsToArray(arguments);
        fulfill.apply(null, args.slice(1));
      };
    });
  }
  this._rpc.call(this._channel + '.' + methodName, args, cb);
  return promise;
};

function argsToArray(args) {
  return Array.prototype.slice.call(args);
}

Client.prototype._createMethod = function(methodName) {
  return function() {
    var args = [methodName].concat(argsToArray(arguments));
    return this.call.apply(this, args);
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
