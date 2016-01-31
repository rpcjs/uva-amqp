'use strict'
const uva = require('..')

uva.server({
  channel: 'math',
  url: 'amqp://guest:guest@localhost:5672',
})
.then(server => {
  server.addMethods({
    sum(a, b, cb) {
      cb(null, a + b)
    },
  })
})
