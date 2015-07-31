# uva-amqp

The [uva][] RPC interface implementation for AMQP.

[![Dependency Status](https://david-dm.org/zkochan/uva-amqp.svg)](https://david-dm.org/zkochan/uva-amqp)
[![Build Status](https://travis-ci.org/zkochan/uva-amqp.svg?branch=master)](https://travis-ci.org/zkochan/uva-amqp)
[![npm version](https://badge.fury.io/js/uva-amqp.svg)](http://badge.fury.io/js/uva-amqp)


## Installation

```
npm install --save uva-amqp
```


## Usage

Create a microservice for mathematical calculations and implement some remote methods.

``` js
var Server = require('uva-amqp').Server;

var server = Server({
  channel: 'mathOperations'
});

server.addMethods({
  sum: function (a, b, cb) {
    cb(null, a + b);
  },
  factorial: function (n, cb) {
    var f = 1;
    for (var i = 2; i <= n; i++) {
      f *= i;
    }
    cb(null, f);
  }
});
```

Create a client for the math microservice and call some of its remote methods.

``` js
var Client = require('uva-amqp').Client;

var client = Client({
  channel: 'mathOperations'
});
client.register(['sum', 'factorial']);

var Math = client.methods;

Math.sum(12, 2, function (err, sum) {
  console.log(sum);
});

Math.factorial(10, function (err, result) {
  console.log(result);
});
```


## License

The MIT License (MIT)


[uva]: https://github.com/zkochan/uva
