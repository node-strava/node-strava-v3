const { setTimeout } = require('timers/promises');

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

uploads.prototype.post = async function (args) {
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

  const response = await this.client.postUpload(args)

  // if no statusCallback, just return after posting upload
  if (typeof args.statusCallback === 'undefined') {
    return
  }

  // otherwise, kick off the status checking loop
  // and return the result of that
  // the callback will be called on each status check
  var checkArgs = {
    id: response.id,
    access_token: args.access_token
  }
  return await self._check(checkArgs, args.statusCallback)

}

uploads.prototype._check = async function (args, cb) {
  var endpoint = 'uploads'
  var self = this

  endpoint += '/' + args.id

  try {
    const response = await this.client.getEndpoint(endpoint, args)

    cb(response.error, response)
    if (!self._uploadIsDone(response)) {
      await setTimeout(1000)
      return await self._check(args, cb)
    }
  } catch (err) {
    cb(err)
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
