'use strict'
const uva = require('..')

uva.client({
  channel: 'math',
  amqpURL: 'amqp://guest:guest@localhost:5672',
})
.then(client => {
  client.sum(1, 2, (err, result) => console.log('sum = ', result))

  client.sum(1, 2)
    .then(result => {
      console.log('got result through promise')
      console.log('sum = ', result)
    })
    .catch(err => console.error(err))
})
