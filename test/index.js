'use strict'

const expect = require('chai').expect
const uva = require('../')

describe('uva-amqp', function() {
  it('should successfully call a remote function', function(done) {
    let server = new uva.Server({
      channel: 'math',
      url: 'amqp://guest:guest@localhost:5672',
    })

    server.addMethod('sum', (a, b, cb) => cb(null, a + b))

    let client = new uva.Client({
      channel: 'math',
      url: 'amqp://guest:guest@localhost:5672',
    })

    client.register(['sum'])

    client.methods.sum(1, 2, function(err, result) {
      expect(err).to.not.exist
      expect(result).to.eq(3)
      done()
    })
  })
})
