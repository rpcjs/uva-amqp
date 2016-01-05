'use strict';

const Qpc = require('qpc');

function Server(opts) {
  opts = opts || {};
  if (!opts.url) {
    throw new TypeError('url is missing from the opts');
  }
  if (!opts.channel) {
    throw new TypeError('channel is missing from the opts');
  }

  this._channel = opts.channel;

  this._rpc = new Qpc({
    url: opts.url,
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

  for (let methodName in scope) {
    this.addMethod(methodName, scope[methodName]);
  }
};

module.exports = Server;
