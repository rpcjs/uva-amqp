# uva-amqp

The [uva][] RPC interface implementation for AMQP.

[![Dependency Status](https://david-dm.org/rpcjs/uva-amqp.svg)](https://david-dm.org/rpcjs/uva-amqp)
[![Build Status](https://travis-ci.org/rpcjs/uva-amqp.svg?branch=master)](https://travis-ci.org/rpcjs/uva-amqp)
[![npm version](https://badge.fury.io/js/uva-amqp.svg)](http://badge.fury.io/js/uva-amqp)


## Installation

```
npm install --save uva-amqp
```


## Usage

Create a microservice for mathematical calculations and implement some remote methods.

``` js
const Server = require('uva-amqp').Server

let server = new Server({
  channel: 'mathOperations',
  url: 'amqp://guest:guest@localhost:5672',
})

server.addMethods({
  sum(a, b, cb) {
    cb(null, a + b)
  },
  factorial(n, cb) {
    let f = 1
    for (let i = 2; i <= n; i++) {
      f *= i
    }
    cb(null, f)
  },
})
```

Create a client for the math microservice and call some of its remote methods.

``` js
const Client = require('uva-amqp').Client

let client = new Client({
  channel: 'mathOperations',
  url: 'amqp://guest:guest@localhost:5672',
})
client.register(['sum', 'factorial'])

let Math = client.methods

Math.sum(12, 2, function(err, sum) {
  console.log(sum)
})

/* if the last argument is not a callback, the function will return a promise */
Math.factorial(10).then(function(result) {
  console.log(result)
}, function(err) {
  console.error(err)
})
```


## License

The MIT License (MIT)


[uva]: https://github.com/rpcjs/uva
