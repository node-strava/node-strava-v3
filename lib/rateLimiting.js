
var RateLimit = {
  requestTime: new Date(), // Date
  shortTermLimit: 0, // Int
  longTermLimit: 0, // Int
  shortTermUsage: 0, // Int
  longTermUsage: 0 // Init
}

var rl = RateLimit

// should be called as `strava.rateLimiting.exceeded()
// to determine if the most recent request exceeded the rate limit
RateLimit.exceeded = function () {
  if (rl.shortTermUsage >= rl.shortTermLimit) {
    return true
  }

  if (rl.longTermUsage >= rl.longTermLimit) {
    return true
  }

  return false
}

// fractionReached returns the current fraction of rate used.
// The greater of the short and long term limits.
// Should be called as `strava.rateLimiting.fractionReached()`
RateLimit.fractionReached = function () {
  var shortLimitFraction = rl.shortTermUsage / rl.shortTermLimit
  var longLimitFraction = rl.longTermUsage / rl.longTermLimit

  if (shortLimitFraction > longLimitFraction) {
    return shortLimitFraction
  } else {
    return longLimitFraction
  }
}

RateLimit.parseRateLimits = function (headers) {
  if (!headers['x-ratelimit-limit'] || !headers['x-ratelimit-usage']) {
    return null
  }

  var limit = headers['x-ratelimit-limit'].split(',')
  var usage = headers['x-ratelimit-usage'].split(',')
  var radix = 10

  return {
    shortTermUsage: parseInt(usage[0], radix),
    shortTermLimit: parseInt(limit[0], radix),
    longTermUsage: parseInt(usage[1], radix),
    longTermLimit: parseInt(limit[1], radix)
  }
}

RateLimit.updateRateLimits = function (headers) {
  var newLimits = this.parseRateLimits(headers)
  if (newLimits) {
    this.requestDate = new Date()
    this.shortTermLimit =
      !isNaN(newLimits.shortTermLimit) ? newLimits.shortTermLimit : 0
    this.shortTermUsage =
      !isNaN(newLimits.shortTermUsage) ? newLimits.shortTermUsage : 0
    this.longTermLimit =
      !isNaN(newLimits.longTermLimit) ? newLimits.longTermLimit : 0
    this.longTermUsage =
      !isNaN(newLimits.longTermUsage) ? newLimits.longTermUsage : 0
  } else {
    this.clear()
  }
  return newLimits
}

RateLimit.clear = function () {
  this.requestTime = new Date()
  this.shortTermLimit = 0
  this.longTermLimit = 0
  this.shortTermUsage = 0
  this.longTermUsage = 0
}

module.exports = RateLimit
