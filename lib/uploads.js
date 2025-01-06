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

uploads.prototype.post = async function (args) {
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

  // Post the upload using async/await
  const payload = await this.client.postUpload(args)

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
}

uploads.prototype._check = async function (args, statusCallback) {
  var endpoint = 'uploads/' + args.id

  try {
    // Await the getEndpoint call
    const payload = await this.client.getEndpoint(endpoint, args)
    // Invoke the user's statusCallback with the latest status
    statusCallback(null, payload)

    // If not done, schedule another check
    if (!this._uploadIsDone(payload)) {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000)
      })
      // Recursively call _check
      return this._check(args, statusCallback)
    }
    // If it's done, just return the final payload
    return payload
  } catch (err) {
    statusCallback(err)
    throw err
  }
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
