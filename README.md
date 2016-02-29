# uva-amqp

The [uva][] RPC interface implementation for AMQP.

[![Dependency Status](https://david-dm.org/rpcjs/uva-amqp.svg)](https://david-dm.org/rpcjs/uva-amqp)
[![Build Status](https://travis-ci.org/rpcjs/uva-amqp.svg?branch=master)](https://travis-ci.org/rpcjs/uva-amqp)
[![npm version](https://badge.fury.io/js/uva-amqp.svg)](http://badge.fury.io/js/uva-amqp)
[![Coverage Status](https://coveralls.io/repos/github/rpcjs/uva-amqp/badge.svg?branch=master)](https://coveralls.io/github/rpcjs/uva-amqp?branch=master)


## Installation

```
npm install --save uva-amqp
```


## Usage

Create a microservice for mathematical calculations and implement some remote methods.

``` js
const uva = require('uva-amqp')

uva.server({
  channel: 'mathOperations',
  amqpURL: 'amqp://guest:guest@localhost:5672',
})
.then(server => {
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
  server.start()
})
```

Create a client for the math microservice and call some of its remote methods.

``` js
const uva = require('uva-amqp')

uva.client({
  channel: 'mathOperations',
  amqpURL: 'amqp://guest:guest@localhost:5672',
})
.then(math => {
  math.sum(12, 2, function (err, sum) {
    console.log(sum)
  })

  /* if the last argument is not a callback, the function will return a promise */
  math.factorial(10).then(function (result) {
    console.log(result)
  }, function (err) {
    console.error(err)
  })
})
```


## License

MIT © [Zoltan Kochan](https://www.kochan.io)


[uva]: https://github.com/rpcjs/uva
