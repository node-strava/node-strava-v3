/**
 * Created by austin on 9/20/14.
 */

var util = require('./util')

var activities = {}
var _qsAllowedProps = [

  // pagination
  'page',
  'per_page',

  // getSegment
  'include_all_efforts'
]
var _createAllowedProps = [
  'name',
  'type',
  'start_date_local',
  'elapsed_time',
  'description',
  'distance',
  'private'
]
var _updateAllowedProps = [
  'name',
  'type',
  'private',
  'commute',
  'trainer',
  'description',
  'gear_id'
]

//= ==== activities endpoint =====
activities.get = function (args, done) {
  var endpoint = 'activities/'
  var err = null
  var qs = util.getQS(_qsAllowedProps, args)

  // require activity id
  if (typeof args.id === 'undefined') {
    err = { msg: 'args must include an activity id' }
    return done(err)
  }

  endpoint += args.id + '?' + qs
  util.getEndpoint(endpoint, args, done)
}
activities.create = function (args, done) {
  var endpoint = 'activities'

  args.body = util.getRequestBodyObj(_createAllowedProps, args)
  util.postEndpoint(endpoint, args, done)
}
activities.update = function (args, done) {
  var endpoint = 'activities/'
  var form = util.getRequestBodyObj(_updateAllowedProps, args)
  var err = null

  // require activity id
  if (typeof args.id === 'undefined') {
    err = { msg: 'args must include an activity id' }
    return done(err)
  }

  endpoint += args.id

  args.form = form

  util.putEndpoint(endpoint, args, done)
}
activities.delete = function (args, done) {
  var endpoint = 'activities/'
  var err = null

  // require activity id
  if (typeof args.id === 'undefined') {
    err = { msg: 'args must include an activity id' }
    return done(err)
  }

  endpoint += args.id
  util.deleteEndpoint(endpoint, args, done)
}
activities.listFriends = function (args, done) {
  var endpoint = 'activities/following/'
  _listHelper(endpoint, args, done)
}
activities.listZones = function (args, done) {
  var endpoint = 'activities/'
  var err = null

  // require activity id
  if (typeof args.id === 'undefined') {
    err = { msg: 'args must include an activity id' }
    return done(err)
  }

  endpoint += args.id + '/zones'

  _listHelper(endpoint, args, done)
}
activities.listLaps = function (args, done) {
  var endpoint = 'activities/'
  var err = null

  // require activity id
  if (typeof args.id === 'undefined') {
    err = { msg: 'args must include an activity id' }
    return done(err)
  }

  endpoint += args.id + '/laps'

  _listHelper(endpoint, args, done)
}
activities.listComments = function (args, done) {
  var endpoint = 'activities/'
  var err = null

  // require activity id
  if (typeof args.id === 'undefined') {
    err = { msg: 'args must include an activity id' }
    return done(err)
  }

  endpoint += args.id + '/comments'

  _listHelper(endpoint, args, done)
}
activities.listKudos = function (args, done) {
  var endpoint = 'activities/'
  var err = null

  // require activity id
  if (typeof args.id === 'undefined') {
    err = { msg: 'args must include an activity id' }
    return done(err)
  }

  endpoint += args.id + '/kudos'

  _listHelper(endpoint, args, done)
}
activities.listPhotos = function (args, done) {
  var endpoint = 'activities/'
  var err = null

  // require activity id
  if (typeof args.id === 'undefined') {
    err = { msg: 'args must include an activity id' }
    return done(err)
  }

  endpoint += args.id + '/photos'

  var pageQS = util.getPaginationQS(args)

  var completeQS = pageQS

  // should be true according to Strava API docs
  args.photo_sources = true
  var argsQS = util.getQS(['size', 'photo_sources'], args)

  if (completeQS && completeQS.length) {
    completeQS += '&'
  }
  completeQS += argsQS

  endpoint += '?' + completeQS

  util.getEndpoint(endpoint, args, done)
}
activities.listRelated = function (args, done) {
  var endpoint = 'activities/'
  var err = null

  if (typeof args.id === 'undefined') {
    err = { msg: 'args must include an activity id' }
    return done(err)
  }

  endpoint += args.id + '/related'

  _listHelper(endpoint, args, done)
}
//= ==== activities endpoint =====

//= ==== helpers =====
var _listHelper = function (endpoint, args, done) {
  var qs = util.getPaginationQS(args)

  endpoint += '?' + qs
  util.getEndpoint(endpoint, args, done)
}
//= ==== helpers =====

module.exports = activities
