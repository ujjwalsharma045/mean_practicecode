
/**
 * Magic number of mills in a day:
 *
 *     1 * 24 * 60 * 60 * 1000
 *
 * @api private
 * @type {Number}
 */
var DAY_IN_MS = 864e5;

/**
 * Get the day of the year from the given `date`
 *
 * Why doesn't `Date` have `tm_yday`?
 *
 * @api public
 * @param {Date} date
 * @return {Number}
 */
module.exports = function (date) {
  if (!date) date = new Date;

  var then = noon(date.getFullYear(), date.getMonth(), date.getDate()),
      first = noon(date.getFullYear(), 0, 0);

  return Math.round((then - first) / DAY_IN_MS);
};

/**
 * Get 12:00 from the given year/month/day
 *
 * @api private
 * @param {Number} year
 * @param {Number} month
 * @param {Number} day
 * @return {Date}
 */
function noon(year, month, day) {
  return new Date(year, month, day, 12, 0, 0);
}
