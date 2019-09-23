var gear = function (client) {
  this.client = client
}

gear.prototype.get = function (args, done) {
  var endpoint = 'gear/'

  // require gear id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a gear id')
  }

  endpoint += args.id
  return this.client.getEndpoint(endpoint, args, done)
}

module.exports = gear
