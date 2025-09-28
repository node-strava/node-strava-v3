var uploads = function (client) {
  this.client = client
}

var _allowedFormProps = [
  'sport_type', // Overrides sport type detected from file, if left unspecified sport type detected from file will be used
  'activity_type', // Deprecated: prefer using sport_type, will be ignored if sport_type is included.
  'name',
  'description',
  'trainer',
  'commute',
  'data_type',
  'external_id'
]

uploads.prototype.post = function (args, done) {
  var self = this

  // various requirements
  if (
    typeof args.file === 'undefined' || typeof args.data_type === 'undefined'
  ) {
    throw new Error('args must include both file and data_type')
  }

  // setup formData for request
  args.formData = {}
  for (var i = 0; i < _allowedFormProps.length; i++) {
    if (args[_allowedFormProps[i]]) { args.formData[_allowedFormProps[i]] = args[_allowedFormProps[i]] }
  }

  return this.client.postUpload(args, function (err, payload) {
    // finish off this branch of the call and let the
    // status checking bit happen after
    done(err, payload)

    if (!err && args.statusCallback) {
      var checkArgs = {
        id: payload.id,
        access_token: args.access_token
      }
      return self._check(checkArgs, args.statusCallback)
    }
  })
}

uploads.prototype._check = function (args, cb) {
  var endpoint = 'uploads'
  var self = this

  endpoint += '/' + args.id
  return this.client.getEndpoint(endpoint, args, function (err, payload) {
    if (!err) {
      cb(err, payload)
      if (!self._uploadIsDone(payload)) {
        setTimeout(function () {
          self._check(args, cb)
        }, 1000)
      }
    } else {
      cb(err)
    }
  })
}

uploads.prototype._uploadIsDone = function (args) {
  var isDone = false

  switch (args.status) {
    case 'Your activity is still being processed.':
      isDone = false
      break

    default:
      isDone = true
  }

  return isDone
}

module.exports = uploads
