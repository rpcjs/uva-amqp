'use strict';

var debug = require('debug')('uva-amqp');
var amqp = require('amqp');
var StateEmitter = require('state-emitter');

function Transport(opts) {
  opts = opts || {};
  StateEmitter.call(this);

  this._queueName = opts.channel;
  this._exchangeName = opts.exchange || opts.channel + '_exchange';
  this._implOptions = opts.ipmlOptions || {
    defaultExchangeName: this._exchangeName
  };

  var conn = amqp.createConnection({
    url: opts.url || 'amqp://guest:guest@localhost:5672'
  }, this._implOptions);

  conn.on('ready', function() {
    this.state('connect', conn);
  }.bind(this));

  this.once('connect', function(conn) {
    conn.queue(this._queueName, function(q) {
      this._makeExchange(function(exchange) {
        q.subscribe(function(message) {
          this._subscribers.forEach(function(subscriber) {
            subscriber.apply({}, message);
          });
        }.bind(this));

        q.bind(exchange, '#');
        this.state('listens');
      }.bind(this));
    }.bind(this));
  }.bind(this));

  this._subscribers = [];
}

Transport.prototype = StateEmitter.prototype;

Transport.prototype.subscribe = function(cb) {
  this._subscribers.push(cb);
};

Transport.prototype.publish = function() {
  var args = Array.prototype.slice.call(arguments);
  this.once('listens', function() {
    this._makeExchange(function(exchange) {
      exchange.publish(this._queueName, args);
    }.bind(this));
  });
};

Transport.prototype._makeExchange = function(cb) {
  this.once('exchange', cb);

  if (this.getState('exchange')) {
    return;
  }

  if (this._creatingExchange) {
    return;
  }
  this._creatingExchange = true;

  /*
   * Added option autoDelete=false.
   * Otherwise we had an error in library node-amqp version > 0.1.7.
   * Text of such error: "PRECONDITION_FAILED - cannot redeclare
   *  exchange '<exchange name>' in vhost '/' with different type,
   *  durable, internal or autodelete value"
   */
   this.once('connect', function(c) {
      c.exchange(this._exchangeName, {
        autoDelete: false
      }, function(exchange) {
        debug('Exchange ' + exchange.name + ' is open');
        this.state('exchange', exchange);
      }.bind(this));
    }.bind(this));
};

module.exports = Transport;
