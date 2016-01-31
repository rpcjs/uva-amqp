'use strict'
const uva = require('..')

let server = uva.server({
  channel: 'math',
  url: 'amqp://guest:guest@localhost:5672',
})
server.addMethods({
  sum(a, b, cb) {
    cb(null, a + b)
  },
})
