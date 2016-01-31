'use strict'
const qpc = require('qpc')

module.exports = function(opts) {
  opts = opts || {}

  if (!opts.url)
    throw new TypeError('url is missing from the opts')

  if (!opts.channel)
    throw new TypeError('channel is missing from the opts')

  let rpc = qpc({
    url: opts.url,
    exchange: opts.channel,
  })

  function addMethod(methodName, method) {
    if (!methodName)
      throw new TypeError('addMethod requires a methodName')

    if (typeof methodName !== 'string')
      throw new TypeError('addMethod requires a methodName of string type')

    if (method === null || typeof method !== 'function')
      throw new TypeError('addMethod requires a callback function')

    rpc.on(methodName, function(args, cb) {
      method.apply({}, args.concat([cb]))
    })
  }

  function addMethods(scope) {
    if (typeof scope !== 'object')
      throw new Error('scope should be an object')

    for (let methodName in scope) {
      addMethod(methodName, scope[methodName])
    }
  }

  return { addMethods, addMethod }
}
