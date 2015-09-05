'use strict';

var Client = require('../lib/client');

var client = new Client({
  amqpURL: 'amqp://guest:guest@localhost:5672'
});

client.register('sum');

client.methods.sum(1, 2, function(result) {
  console.log('sum = ', result);
});
