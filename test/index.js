'use strict'
const expect = require('chai').expect
const uva = require('../')

describe('uva-amqp', function() {
  it('should successfully call a remote function', function(done) {
    this.timeout(1e4)

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

  it('should return a timeout if no response has been recieved in time', function(done) {
    let client = new uva.Client({
      channel: 'foo',
      url: 'amqp://guest:guest@localhost:5672',
      ttl: 100,
    })

    client.register(['bar'])

    client.methods.bar(function(err, result) {
      expect(err).to.be.instanceOf(Error)
      done()
    })
  })

  it('should return promise if last argunent not a callback', function() {
    let client = new uva.Client({
      channel: 'foo',
      url: 'amqp://guest:guest@localhost:5672',
      ttl: 100,
    })

    client.register(['bar'])

    let promise = client.methods.bar(1)

    expect(promise).to.be.an.instanceOf(Promise)
  })
})
