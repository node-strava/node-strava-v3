var clubs = function (client) {
  this.client = client
}

//= ==== clubs endpoint =====
clubs.prototype.get = function (args, done) {
  var endpoint = 'clubs/'

  // require club id
  if (typeof args.id === 'undefined') {
    const err = { msg: 'args must include a club id' }
    return done(err)
  }

  endpoint += args.id
  return this.client.getEndpoint(endpoint, args, done)
}
clubs.prototype.listMembers = function (args, done) {
  return this._listHelper('members', args, done)
}
clubs.prototype.listActivities = function (args, done) {
  return this._listHelper('activities', args, done)
}
clubs.prototype.listAnnouncements = function (args, done) {
  return this._listHelper('announcements', args, done)
}
clubs.prototype.listEvents = function (args, done) {
  return this._listHelper('group_events', args, done)
}
clubs.prototype.listAdmins = function (args, done) {
  return this._listHelper('admins', args, done)
}
clubs.prototype.joinClub = function (args, done) {
  return this._listHelper('join', args, done)
}
clubs.prototype.leaveClub = function (args, done) {
  return this._listHelper('leave', args, done)
}
//= ==== clubs endpoint =====

//= ==== helpers =====
clubs.prototype._listHelper = function (listType, args, done) {
  var endpoint = 'clubs/'
  var err = null
  var qs = this.client.getPaginationQS(args)

  // require club id
  if (typeof args.id === 'undefined') {
    err = { 'msg': 'args must include a club id' }
    return done(err)
  }

  endpoint += args.id + '/' + listType + '?' + qs

  return this.client.getEndpoint(endpoint, args, done)
}
//= ==== helpers =====

module.exports = clubs
