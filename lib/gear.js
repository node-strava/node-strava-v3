export class Gear {
  constructor (client) {
    this.client = client
  }

  get (args) {
    var endpoint = 'gear/'

    // require gear id
    if (typeof args.id === 'undefined') {
      throw new Error('args must include a gear id')
    }
    endpoint += args.id
    return this.client.getEndpoint(endpoint, args)
  }
}
