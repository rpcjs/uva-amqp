'use strict';

var amqpRpc = require('amqp-rpc');

function Server(opts) {
  opts = opts || {};
  if (!opts.amqpURL) {
    throw new TypeError('amqpURL is missing from the opts');
  }
  if (!opts.channel) {
    throw new TypeError('channel is missing from the opts');
  }

  this._channel = opts.channel;

  this._rpc = amqpRpc.factory({
    url: opts._amqpURL
  });
}

Server.prototype.addMethod = function(methodName, method) {
  if (!methodName) {
    throw new TypeError('addMethod requires a methodName');
  }
  if (typeof methodName !== 'string') {
    throw new TypeError('addMethod requires a methodName of string type');
  }
  if (method === null || typeof method !== 'function') {
    throw new TypeError('addMethod requires a callback function');
  }

  this._rpc.on(this._channel + '.' + methodName, function(args, cb) {
    method.apply({}, args.concat([cb]));
  });
};

Server.prototype.addMethods = function(scope) {
  if (typeof scope !== 'object') {
    throw new Error('scope should be an object');
  }

  for (var methodName in scope) {
    this.addMethod(methodName, scope[methodName]);
  }
};

module.exports = Server;
