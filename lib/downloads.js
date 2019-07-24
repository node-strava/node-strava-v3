var util = require('./util')

var downloads = {}
var _qsAllowedProps = []

downloads.route = function (args, done) {
  var endpoint = ''
  var err = null
  var qs = util.getQS(_qsAllowedProps, args)

  // require route id
  if (typeof args.id === 'undefined') {
    err = {
      msg: 'args must include an route id'
    }
    return done(err)
  }
  // require file tyle (gpx|tcx)
  if (typeof args.type === 'undefined' || !['gpx', 'tcx'].includes(args.type)) {
    err = {
      msg: 'args must include a file type (either gpx or tcx)'
    }
    return done(err)
  }

  var pathByType = ''
  if (args.type === 'gpx') {
    pathByType = 'export_gpx'
  } else if (args.type === 'tcx') {
    pathByType = 'export_tcx'
  }

  endpoint = '/routes/' + args.id + '/' + pathByType + '?' + qs
  util.getEndpoint(endpoint, args, done)
}

module.exports = downloads
