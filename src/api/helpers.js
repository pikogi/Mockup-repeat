/**
 * Build a query string from an object, omitting falsy values.
 * Returns '' or '?key=val&key2=val2'.
 */
export function buildQueryString(params) {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      sp.set(key, value)
    }
  }
  const str = sp.toString()
  return str ? `?${str}` : ''
}
