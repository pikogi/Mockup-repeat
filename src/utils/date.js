/** Format a Date as yyyy-MM-dd in UTC */
export function formatDateUTC(date) {
  return date.toISOString().slice(0, 10)
}

/** Add N days in UTC */
export function addDaysUTC(date, days) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

/** Subtract N days in UTC */
export function subDaysUTC(date, days) {
  return addDaysUTC(date, -days)
}

/** First day of the month in UTC */
export function startOfMonthUTC(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))
}
