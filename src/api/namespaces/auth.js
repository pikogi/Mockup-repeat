import posthog from 'posthog-js'
import { processAuthToken } from '../authHelpers'
import { setCachedToken, clearAuthStorage } from '../client'
import { getDeviceInfo } from '@/utils/device'

export function createAuthNamespace(client) {
  return {
    login: async (email, password) => {
      const res = await client.post('/auth/login', { email, password })
      const token = res.token || res.data?.token
      if (token) {
        clearAuthStorage()
        setCachedToken(token)
        const decoded = processAuthToken(token, { clearBrandId: true })

        if (decoded?.onboarding_completed !== undefined && decoded?.onboarding_completed !== null) {
          localStorage.setItem('user_onboarding_completed', String(decoded.onboarding_completed))
        } else {
          const existing = localStorage.getItem('user_onboarding_completed')
          if (existing === null) {
            localStorage.setItem('user_onboarding_completed', 'false')
          }
        }

        if (decoded && posthog.__loaded) {
          posthog.identify(decoded.user_id, {
            email: decoded.email,
            name: decoded.full_name,
            brand_id: decoded.brand_id,
            user_type: decoded.user_type,
            ...getDeviceInfo(),
          })
        }
      }
      return res
    },

    register: async (email, password, name) => {
      const res = await client.post('/auth/brand-admin', {
        email,
        password,
        full_name: name,
      })
      const jwtToken = res.token || res.data?.token
      if (jwtToken) {
        setCachedToken(jwtToken)
        const decoded = processAuthToken(jwtToken)

        if (decoded && posthog.__loaded) {
          posthog.identify(decoded.user_id, {
            email: decoded.email,
            name: decoded.full_name,
            user_type: decoded.user_type || 'brand_admin',
            ...getDeviceInfo(),
          })
        }

        try {
          const brandAdminResponse = await client.patch('/auth/brand-admin', {})
          const onboardingCompleted =
            brandAdminResponse?.data?.onboarding_completed || brandAdminResponse?.onboarding_completed
          if (onboardingCompleted !== undefined && onboardingCompleted !== null) {
            localStorage.setItem('user_onboarding_completed', String(onboardingCompleted))
          } else {
            localStorage.setItem('user_onboarding_completed', 'false')
          }
        } catch {
          localStorage.setItem('user_onboarding_completed', 'false')
        }
      }
      return res
    },

    verifyEmail: async (email, token) => {
      const res = await client.post('/auth/verify-email', { email, token })
      const jwtToken = res.token || res.data?.token
      if (jwtToken) {
        setCachedToken(jwtToken)
        processAuthToken(jwtToken, { clearBrandId: true })
      }
      return res
    },

    resetPassword: async (email) => {
      return client.post('/auth/reset-password', { email })
    },

    updatePassword: async (email, token, password) => {
      return client.post('/auth/update-password', { email, token, password })
    },

    me: async () => {
      return client.get('/auth/me')
    },

    updateBrandAdmin: async (data) => {
      const res = await client.patch('/auth/brand-admin', data)
      const token = res?.data?.token || res?.token
      if (token) {
        setCachedToken(token)
        if (data.onboarding_completed !== undefined) {
          localStorage.setItem('user_onboarding_completed', String(data.onboarding_completed))
        }
      }
      return res
    },

    logout: () => {
      if (posthog.__loaded) {
        posthog.reset()
      }
      setCachedToken(null)
      clearAuthStorage()
    },
  }
}
