var clubs = function (client) {
  this.client = client
}

//= ==== clubs endpoint =====
clubs.prototype.get = function (args) {
  var endpoint = 'clubs/'

  // require club id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a club id')
  }

  endpoint += args.id
  return this.client.getEndpoint(endpoint, args)
}

clubs.prototype.listMembers = function (args) {
  return this._listHelper('members', args)
}

clubs.prototype.listActivities = function (args) {
  return this._listHelper('activities', args)
}

clubs.prototype.listAdmins = function (args) {
  return this._listHelper('admins', args)
}
//= ==== clubs endpoint =====

//= ==== helpers =====
clubs.prototype._listHelper = function (listType, args) {
  var endpoint = 'clubs/'
  var qs = this.client.getPaginationQS(args)

  // require club id
  if (typeof args.id === 'undefined') {
    throw new Error('args must include a club id')
  }

  endpoint += args.id + '/' + listType + '?' + qs
  return this.client.getEndpoint(endpoint, args)
}
//= ==== helpers =====

module.exports = clubs
