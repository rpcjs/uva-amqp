'use strict'
const thenify = require('thenify').withCallback
const util = require('util')
const qpc = require('qpc')
const debug = require('debug')('uva-amqp')
const chalk = require('chalk')

module.exports = function(opts) {
  opts = opts || {}

  if (!opts.url)
    throw new TypeError('url is missing from the opts')

  if (!opts.channel)
    throw new TypeError('channel is missing from the opts')

  let methods = {}

  let rpc = qpc({
    url: opts.url,
    ttl: opts.ttl || 5e3,
    exchange: opts.channel,
  })

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

    rpc.call(methodName, args, (err, value) => {
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

  function register(newMethods) {
    newMethods = [].concat(newMethods)

    newMethods
      .filter(mn => typeof methods[mn] === 'undefined')
      .forEach(mn => methods[mn] = createMethod(mn))
  }

  return {
    call,
    register,
    methods,
  }
}
