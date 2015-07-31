'use strict';

var Client = require('../lib/client');

var client = new Client({
  channel: 'math'
});

client.register('sum');

client.methods.sum(1, 2, function(result) {
  console.log('sum = ', result);
});
