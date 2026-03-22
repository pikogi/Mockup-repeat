import { decodeJWT } from '@/utils/jwt'

/**
 * Decode a JWT and persist user metadata (userType, email, full_name) to localStorage.
 * Returns the decoded token payload.
 */
export function processAuthToken(token, { clearBrandId = false } = {}) {
  const decoded = decodeJWT(token)

  if (decoded && clearBrandId && decoded.brand_id) {
    localStorage.removeItem('user_brand_id')
  }

  if (decoded?.user_type) localStorage.setItem('user_type_user', decoded.user_type)
  if (decoded?.email) localStorage.setItem('user_email', decoded.email)
  if (decoded?.full_name) localStorage.setItem('user_full_name', decoded.full_name)

  return decoded
}
