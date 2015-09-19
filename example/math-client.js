'use strict';

var Client = require('../lib/client');

var client = new Client({
  channel: 'math',
  url: 'amqp://guest:guest@localhost:5672'
});

client.register('sum');

client.methods.sum(1, 2, function(err, result) {
  console.log('sum = ', result);
});

client.methods.sum(1, 2)
  .then(function(result) {
    console.log('got result through promise');
    console.log('sum = ', result);
  });
