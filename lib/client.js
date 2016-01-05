'use strict';

const thenify = require('thenify').withCallback;
const util = require('util');
const Qpc = require('qpc');
const debug = require('debug')('uva-amqp');

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

  this._rpc = new Qpc({
    url: opts.url,
  });
}

Client.prototype.call = thenify(function(methodName) {
  let args = [];
  let i = 0;
  let cb;

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

  this._rpc.call(this._channel + '.' + methodName, args, cb);
});

function argsToArray(args) {
  return Array.prototype.slice.call(args);
}

Client.prototype._createMethod = function(methodName) {
  return function() {
    let args = [methodName].concat(argsToArray(arguments));
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
