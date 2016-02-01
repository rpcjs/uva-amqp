'use strict'
const thenify = require('thenify').withCallback
const util = require('util')
const qpc = require('qpc')
const debug = require('debug')('uva-amqp')
const chalk = require('chalk')

module.exports = function(opts) {
  opts = opts || {}

  if (!opts.amqpURL)
    throw new TypeError('amqpURL is missing from the opts')

  if (!opts.channel)
    throw new TypeError('channel is missing from the opts')

  return qpc.publisher({
    amqpURL: opts.amqpURL,
    ttl: opts.ttl || 5e3,
    exchangeName: opts.channel,
  })
  .then(pub => {
    let call = thenify(function(methodName) {
      if (!methodName)
        throw new TypeError('call requires a methodName')

      if (typeof methodName !== 'string')
        throw new TypeError('call requires a methodName of string type')

      let args = []
      let i = 0

      while (typeof arguments[++i] !== 'function' && i < arguments.length)
        args.push(arguments[i])

      let cb = typeof arguments[i] === 'function' ? arguments[i] : undefined

      debug('calling %s with args %s', chalk.magenta(methodName),
        chalk.yellow(JSON.stringify(args)))

      pub.call(opts.channel + '.' + methodName, args, (err, value) => {
        if (err) {
          debug('error happened during calling ' + chalk.magenta(methodName) +
            '. ' + chalk.red(err))
          return cb(err, value)
        }

        debug('successfully executed ' + chalk.magenta(methodName) +
          '. Response: ' + chalk.yellow(JSON.stringify(value)))
        cb(err, value)
      })
    })

    function argsToArray(args) {
      return Array.prototype.slice.call(args)
    }

    function createMethod(methodName) {
      return function() {
        let args = [methodName].concat(argsToArray(arguments))
        return call.apply(null, args)
      }
    }

    function register(methodNames) {
      methodNames = [].concat(methodNames)

      let result = {}
      methodNames.forEach(methodName => {
        result[methodName] = createMethod(methodName)
      })

      return result
    }

    if (opts.register) {
      return Promise.resolve(register(opts.register))
    }

    return call('methodsList')
      .then(methods => {
        return Promise.resolve(register(methods))
      })
  })
}
