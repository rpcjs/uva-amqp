'use strict'
const qpc = require('qpc')
const createDebug = require('debug')
const chalk = require('chalk')

module.exports = function (opts) {
  opts = opts || {}

  if (!opts.amqpURL) {
    throw new TypeError('amqpURL is missing from the opts')
  }

  if (!opts.channel) {
    throw new TypeError('channel is missing from the opts')
  }

  const debug = createDebug('uva-amqp:' + opts.channel + ':server')

  return qpc.consumer({
    amqpURL: opts.amqpURL,
    exchangeName: opts.channel,
  })
  .then(consumer => {
    const methods = []

    function addMethod (methodName, method) {
      if (!methodName) {
        throw new TypeError('addMethod requires a methodName')
      }

      if (typeof methodName !== 'string') {
        throw new TypeError('addMethod requires a methodName of string type')
      }

      if (method === null || typeof method !== 'function') {
        throw new TypeError('addMethod requires a callback function')
      }

      methods.push(methodName)

      consumer.on(opts.channel + '.' + methodName, (args, cb) => {
        debug('%s called with args: %s', chalk.magenta(methodName),
          chalk.yellow(JSON.stringify(args)))

        method.apply({}, args.concat([function (err, value) {
          if (err) {
            debug('%s handler failed. Error details: %s',
              chalk.magenta(methodName), err.toString())
          } else {
            debug('%s handler successfully executed. Result: %s',
              chalk.magenta(methodName), chalk.yellow(JSON.stringify(value)))
          }

          cb.apply({}, arguments)
        },]))
      })
    }

    function addMethods (scope) {
      if (typeof scope !== 'object') {
        throw new Error('scope should be an object')
      }

      for (let methodName in scope) {
        addMethod(methodName, scope[methodName])
      }
    }

    function start () {
      addMethod('methodsList', cb => cb(null, methods))
    }

    return Promise.resolve({ addMethods, addMethod, start })
  })
}
