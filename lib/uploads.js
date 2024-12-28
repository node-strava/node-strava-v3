var uploads = function (client) {
  this.client = client
}

var _allowedFormProps = [
  'activity_type',
  'name',
  'description',
  'private',
  'trainer',
  'data_type'
]

uploads.prototype.post = function (args) {
  // various requirements
  if (
    typeof args.file === 'undefined' ||
    typeof args.data_type === 'undefined'
  ) {
    throw new Error('args must include both file and data_type')
  }

  // setup formData for request
  args.formData = {}
  for (var i = 0; i < _allowedFormProps.length; i++) {
    if (args[_allowedFormProps[i]]) {
      args.formData[_allowedFormProps[i]] = args[_allowedFormProps[i]]
    }
  }

  // Post the upload, returning a promise
  return this.client.postUpload(args).then((payload) => {
    // If the user provided a statusCallback, start checking periodically
    if (!payload.err && args.statusCallback) {
      var checkArgs = {
        id: payload.id,
        access_token: args.access_token
      }
      // Kick off the status checks in the background
      this._check(checkArgs, args.statusCallback)
    }
    return payload
  })
}

uploads.prototype._check = function (args, statusCallback) {
  var endpoint = 'uploads/' + args.id

  // Convert to a promise-based approach
  return this.client.getEndpoint(endpoint, args).then((payload) => {
    // Invoke the user's statusCallback with the latest status
    statusCallback(null, payload)

    // If not done, schedule another check
    if (!this._uploadIsDone(payload)) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Recursively call _check, chaining the promise
          this._check(args, statusCallback).then(resolve).catch(reject)
        }, 1000)
      })
    }
    // If it's done, just resolve immediately with the final payload
    return payload
  }).catch((err) => {
    statusCallback(err)
    throw err
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
