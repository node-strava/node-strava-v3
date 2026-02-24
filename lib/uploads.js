const { setTimeout } = require('timers/promises')

/** @typedef {import('../index').Upload} Upload */
/** @typedef {import('./httpClient').StravaRouteClient} StravaRouteClient */

/**
 * Args for posting a file upload (file and data_type required).
 * @typedef {Object} PostUploadArgs
 * @property {string} file - Path to file (required for post).
 * @property {string} data_type - Data type (required for post).
 * @property {string} [sport_type] - Overrides sport type detected from file.
 * @property {string} [activity_type] - Deprecated: prefer sport_type.
 * @property {string} [name]
 * @property {string} [description]
 * @property {0|1} [trainer] - API expects integer; set to 1 to mark as trainer.
 * @property {0|1} [commute] - API expects integer; set to 1 to mark as commute.
 * @property {string} [external_id]
 * @property {string} [access_token]
 * @property {(error: import('../index').CallbackError | null, response?: Upload) => void} [statusCallback]
 * @property {number} [maxStatusChecks] - Max polling attempts when using statusCallback (default 300 ≈ 5 min at 1s).
 * @property {Record<string, string>} [formData] - Set by post(); do not pass.
 */

/**
 * Args for checking upload status by id.
 * @typedef {Object} CheckArgs
 * @property {string} id - Upload id.
 * @property {string | undefined} [access_token] - Optional; may be undefined.
 * @property {number} [maxChecks] - Max polling attempts before timing out.
 */

/** @type {readonly string[]} */
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

/**
 * Uploads API client for posting files (e.g. GPX/TCX) to create activities.
 * @param {StravaRouteClient} client - HTTP client instance for Strava API requests
 */
var uploads = function (client) {
  this.client = client
}

/**
 * Uploads a file to create a new activity; optionally polls status via statusCallback until done.
 * @param {PostUploadArgs} args
 * @returns {Promise<Upload>}
 */
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
  const argsRecord = /** @type {Record<string, string>} */ (/** @type {unknown} */ (args))
  for (var i = 0; i < _allowedFormProps.length; i++) {
    const key = _allowedFormProps[i]
    if (argsRecord[key] != null) {
      args.formData[key] = argsRecord[key]
    }
  }

  const response = await this.client.postUpload(args)

  // if no statusCallback, just return after posting upload
  if (typeof args.statusCallback === 'undefined') {
    return response
  }

  // otherwise, kick off the status checking loop
  // and return the result of that
  // the callback will be called on each status check
  /** @type {CheckArgs} */
  var checkArgs = {
    id: response.id,
    access_token: args.access_token || undefined,
    maxChecks: args.maxStatusChecks != null ? args.maxStatusChecks : 300
  }
  return await self._check(checkArgs, args.statusCallback)
}

/**
 * Internal: polls upload status and invokes callback until the upload is done or maxChecks is reached.
 * @param {CheckArgs} args
 * @param {(error: import('../index').CallbackError | null, response?: Upload) => void} cb
 * @returns {Promise<Upload>}
 */
uploads.prototype._check = async function (args, cb) {
  var endpoint = 'uploads/' + args.id
  var self = this
  var maxChecks = args.maxChecks != null ? args.maxChecks : 300
  var attempts = 0

  try {
    while (true) {
      attempts++
      const response = /** @type {Upload} */ (await this.client.getEndpoint(endpoint, args))

      const error = typeof response.error === 'undefined' ? null : response.error
      cb(error, response)

      if (self._uploadIsDone(response)) {
        return response
      }

      if (attempts >= maxChecks) {
        break
      }

      await setTimeout(1000)
    }
  } catch (err) {
    cb(/** @type {import('../index').CallbackError} */ (err))
    throw err
  }

  const timeoutError = new Error(
    'Upload status check timed out after ' + maxChecks + ' attempts (still processing)'
  )
  cb(/** @type {import('../index').CallbackError} */ (timeoutError))
  throw timeoutError
}

/**
 * Internal: returns whether an upload response indicates processing is complete.
 * @param {Upload} args
 * @returns {boolean}
 */
uploads.prototype._uploadIsDone = function (args) {
  switch (args.status) {
    case 'Your activity is still being processed.':
      return false

    default:
      return true
  }
}

module.exports = uploads
