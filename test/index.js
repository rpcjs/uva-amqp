'use strict'
const chai = require('chai')
const expect = chai.expect
const uva = require('..')

chai.use(require('chai-as-promised'))

describe('uva-amqp', function() {
  it('should successfully call a remote function', function(done) {
    this.timeout(1e4)

    return uva.server({
      channel: 'math',
      url: 'amqp://guest:guest@localhost:5672',
    })
    .then(server => {
      server.addMethod('sum', (a, b, cb) => cb(null, a + b))

      return uva.client({
        channel: 'math',
        url: 'amqp://guest:guest@localhost:5672',
      })
    })
    .then(client => {
      client.register(['sum'])

      client.methods.sum(1, 2, function(err, result) {
        expect(err).to.not.exist
        expect(result).to.eq(3)
        done()
      })
    })
  })

  it('should return a timeout if no response has been recieved in time', function(done) {
    return uva.client({
      channel: 'foo',
      url: 'amqp://guest:guest@localhost:5672',
      ttl: 100,
    })
    .then(client => {
      client.register(['bar'])

      client.methods.bar(function(err, result) {
        expect(err).to.be.instanceOf(Error)
        done()
      })
    })
  })

  it('should reject if no response has been recieved in time', function(done) {
    return uva.client({
      channel: 'foo',
      url: 'amqp://guest:guest@localhost:5672',
      ttl: 100,
    })
    .then(client => {
      client.register(['bar'])

      let res = client.methods.bar()

      expect(res).to.be.rejectedWith(Error).notify(done)
    })
  })

  it('should return promise if last argument not a callback', function() {
    return uva.client({
      channel: 'foo',
      url: 'amqp://guest:guest@localhost:5672',
      ttl: 100,
    })
    .then(client => {
      client.register(['bar'])

      let promise = client.methods.bar(1)

      expect(promise).to.be.an.instanceOf(Promise)
    })
  })
})
