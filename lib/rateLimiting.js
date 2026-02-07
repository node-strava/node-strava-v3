// @ts-check
/**
 * @typedef {Object} ParsedRateLimits
 * @property {number} shortTermUsage
 * @property {number} shortTermLimit
 * @property {number} longTermUsage
 * @property {number} longTermLimit
 * @property {number} readShortTermUsage
 * @property {number} readShortTermLimit
 * @property {number} readLongTermUsage
 * @property {number} readLongTermLimit
 */

/**
 * In-memory rate limit state for Strava API (short/long and read limits), including methods.
 * @typedef {Object} RateLimitState
 * @property {Date} requestTime
 * @property {number} shortTermLimit
 * @property {number} longTermLimit
 * @property {number} shortTermUsage
 * @property {number} longTermUsage
 * @property {number} readShortTermLimit
 * @property {number} readLongTermLimit
 * @property {number} readShortTermUsage
 * @property {number} readLongTermUsage
 * @property {function(): boolean} exceeded
 * @property {function(): number} fractionReached
 * @property {function(): boolean} readExceeded
 * @property {function(): number} readFractionReached
 * @property {function({ [x: string]: string|string[]|undefined }): ParsedRateLimits|null} parseRateLimits
 * @property {function(this: RateLimitState, { [x: string]: string|string[]|undefined }): ParsedRateLimits|null} updateRateLimits
 * @property {function(this: RateLimitState): void} clear
 */

var RateLimit = /** @type {RateLimitState} */ ({
  requestTime: new Date(),
  shortTermLimit: 0,
  longTermLimit: 0,
  shortTermUsage: 0,
  longTermUsage: 0,
  readShortTermLimit: 0,
  readLongTermLimit: 0,
  readShortTermUsage: 0,
  readLongTermUsage: 0
})

var rl = RateLimit

/**
 * Returns whether the most recent request exceeded the (write) rate limit.
 * Call as `strava.rateLimiting.exceeded()`.
 * @returns {boolean} True if short-term or long-term limit was reached.
 */
RateLimit.exceeded = function () {
  if (rl.shortTermLimit > 0 && rl.shortTermUsage >= rl.shortTermLimit) {
    return true
  }

  if (rl.longTermLimit > 0 && rl.longTermUsage >= rl.longTermLimit) {
    return true
  }

  return false
}

/**
 * Returns the current fraction of overall rate used, the greater of short and long term.
 * Call as `strava.rateLimiting.fractionReached()`.
 * @returns {number} Fraction in [0, 1+] (0 if no limits set).
 */
RateLimit.fractionReached = function () {
  var shortLimitFraction = rl.shortTermLimit > 0
    ? rl.shortTermUsage / rl.shortTermLimit
    : 0
  var longLimitFraction = rl.longTermLimit > 0
    ? rl.longTermUsage / rl.longTermLimit
    : 0

  if (shortLimitFraction > longLimitFraction) {
    return shortLimitFraction
  } else {
    return longLimitFraction
  }
}

/**
 * Returns whether the most recent request exceeded the read rate limit.
 * Call as `strava.rateLimiting.readExceeded()`.
 * @returns {boolean} True if read short-term or long-term limit was reached.
 */
RateLimit.readExceeded = function () {
  if (rl.readShortTermLimit > 0 && rl.readShortTermUsage >= rl.readShortTermLimit) {
    return true
  }

  if (rl.readLongTermLimit > 0 && rl.readLongTermUsage >= rl.readLongTermLimit) {
    return true
  }

  return false
}

/**
 * Returns the current fraction of read rate used, the greater of short and long term.
 * Call as `strava.rateLimiting.readFractionReached()`.
 * @returns {number} Fraction in [0, 1+] (0 if no limits set).
 */
RateLimit.readFractionReached = function () {
  var shortLimitFraction = rl.readShortTermLimit > 0
    ? rl.readShortTermUsage / rl.readShortTermLimit
    : 0
  var longLimitFraction = rl.readLongTermLimit > 0
    ? rl.readLongTermUsage / rl.readLongTermLimit
    : 0

  if (shortLimitFraction > longLimitFraction) {
    return shortLimitFraction
  } else {
    return longLimitFraction
  }
}

/**
 * Parses Strava rate-limit response headers into numeric usage/limit fields.
 * @param {Object.<string, string|string[]|undefined>} headers - Response headers (e.g. from axios); must include x-ratelimit-limit, x-ratelimit-usage, x-readratelimit-limit, x-readratelimit-usage.
 * @returns {ParsedRateLimits|null} Parsed limits object or null if headers are missing/invalid.
 */
RateLimit.parseRateLimits = function (headers) {
  if (!headers || !headers['x-ratelimit-limit'] || !headers['x-ratelimit-usage'] ||
      !headers['x-readratelimit-limit'] || !headers['x-readratelimit-usage']) {
    return null
  }

  var limit = /** @type {string} */ (headers['x-ratelimit-limit']).split(',')
  var usage = /** @type {string} */ (headers['x-ratelimit-usage']).split(',')
  var readLimit = /** @type {string} */ (headers['x-readratelimit-limit']).split(',')
  var readUsage = /** @type {string} */ (headers['x-readratelimit-usage']).split(',')
  var radix = 10

  return /** @type {ParsedRateLimits} */ ({
    shortTermUsage: parseInt(usage[0], radix),
    shortTermLimit: parseInt(limit[0], radix),
    longTermUsage: parseInt(usage[1], radix),
    longTermLimit: parseInt(limit[1], radix),
    readShortTermUsage: parseInt(readUsage[0], radix),
    readShortTermLimit: parseInt(readLimit[0], radix),
    readLongTermUsage: parseInt(readUsage[1], radix),
    readLongTermLimit: parseInt(readLimit[1], radix)
  })
}

/**
 * Updates internal rate limit state from response headers.
 * @this {RateLimitState}
 * @param {Object.<string, string|string[]|undefined>} headers - Response headers containing rate limit fields.
 * @returns {ParsedRateLimits|null} Parsed limits object if headers were valid, otherwise null.
 */
// eslint-disable-next-line no-extra-parens -- cast required so assignment satisfies RateLimitState
RateLimit.updateRateLimits = /** @type {RateLimitState['updateRateLimits']} */ (function (headers) {
  var newLimits = this.parseRateLimits(headers)
  if (newLimits) {
    this.requestTime = new Date()
    this.shortTermLimit =
      !isNaN(newLimits.shortTermLimit) ? newLimits.shortTermLimit : 0
    this.shortTermUsage =
      !isNaN(newLimits.shortTermUsage) ? newLimits.shortTermUsage : 0
    this.longTermLimit =
      !isNaN(newLimits.longTermLimit) ? newLimits.longTermLimit : 0
    this.longTermUsage =
      !isNaN(newLimits.longTermUsage) ? newLimits.longTermUsage : 0
    this.readShortTermLimit =
      !isNaN(newLimits.readShortTermLimit) ? newLimits.readShortTermLimit : 0
    this.readShortTermUsage =
      !isNaN(newLimits.readShortTermUsage) ? newLimits.readShortTermUsage : 0
    this.readLongTermLimit =
      !isNaN(newLimits.readLongTermLimit) ? newLimits.readLongTermLimit : 0
    this.readLongTermUsage =
      !isNaN(newLimits.readLongTermUsage) ? newLimits.readLongTermUsage : 0
  } else {
    this.clear()
  }
  return newLimits
})

/**
 * Resets all rate limit counters and timestamps to zero.
 * @returns {void}
 */
RateLimit.clear = function () {
  this.requestTime = new Date()
  this.shortTermLimit = 0
  this.longTermLimit = 0
  this.shortTermUsage = 0
  this.longTermUsage = 0
  this.readShortTermLimit = 0
  this.readLongTermLimit = 0
  this.readShortTermUsage = 0
  this.readLongTermUsage = 0
}

module.exports = RateLimit
