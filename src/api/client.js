// src/api/client.js — Core HTTP layer + token management + namespace assembly

import { createAuthNamespace } from './namespaces/auth'
import { createBrandsNamespace } from './namespaces/brands'
import { createImagesNamespace } from './namespaces/images'
import { createLoyaltyCardsNamespace } from './namespaces/loyaltyCards'
import { createLoyaltyProgramsNamespace } from './namespaces/loyaltyPrograms'
import { createStoresNamespace } from './namespaces/stores'
import { createTransactionsNamespace } from './namespaces/transactions'

const S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET_PROGRAM_IMAGES
export const PROGRAM_IMAGES_BASE_URL = `https://${S3_BUCKET}.s3.us-east-1.amazonaws.com`
const envApiUrl = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY
const isDev = import.meta.env.DEV

if (!isDev && !envApiUrl) {
  console.error('VITE_API_URL is not configured. API calls will fail.')
}
const API_BASE_URL = isDev ? '/api' : envApiUrl

// localStorage keys related to the user session
const AUTH_STORAGE_KEYS = [
  'auth_token',
  'user_brand_id',
  'user_type_user',
  'user_email',
  'user_full_name',
  'user_onboarding_completed',
  'brand_id',
  'brand_name',
  'operating_branch_id',
  'programs-storage',
  'stores-storage',
]

export function clearAuthStorage() {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
}

// Cache the auth token in memory to avoid reading localStorage on every request
let _cachedToken = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null

export function getCachedToken() {
  if (_cachedToken && !localStorage.getItem('auth_token')) {
    _cachedToken = null
  }
  return _cachedToken
}

export function setCachedToken(token) {
  _cachedToken = token
  if (token) {
    localStorage.setItem('auth_token', token)
  } else {
    localStorage.removeItem('auth_token')
  }
}

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL

    // Domain namespaces
    this.auth = createAuthNamespace(this)
    this.brands = createBrandsNamespace(this)
    this.stores = createStoresNamespace(this)
    this.loyaltyPrograms = createLoyaltyProgramsNamespace(this)
    this.loyaltyCards = createLoyaltyCardsNamespace(this)
    this.transactions = createTransactionsNamespace(this)
    this.images = createImagesNamespace(this)

    // Tiny namespaces kept inline
    this.health = { check: () => this.get('/health') }
    this.redemptions = { update: (redemptionId, status) => this.patch(`/redemptions/${redemptionId}`, { status }) }
    this.shortUrls = { resolve: (code) => this.publicRequest(`/short-urls/${code}`) }
    this.notifications = {
      sendWalletNotification: (brandId, programId, message) =>
        this.post('/notifications/wallet', {
          brand_id: brandId,
          ...(programId && { program_id: programId }),
          message,
        }),
    }
  }

  async publicRequest(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(API_KEY && { 'x-api-key': API_KEY }),
      ...options.headers,
    }

    const fullUrl = `${this.baseURL}${endpoint}`
    const response = await fetch(fullUrl, { ...options, headers })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
      const error = new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      error.response = { status: response.status, data: errorData }
      throw error
    }

    return response.json()
  }

  async request(endpoint, options = {}) {
    const token = getCachedToken()

    const publicEndpoints = [
      '/auth/verify-email',
      '/auth/login',
      '/auth/reset-password',
      '/auth/update-password',
      '/health',
    ]
    const endpointPath = endpoint.split('?')[0]
    const isPublicEndpoint = publicEndpoints.some(
      (publicPath) => endpointPath === publicPath || endpointPath.startsWith(publicPath + '/'),
    )

    const headers = {
      'Content-Type': 'application/json',
      ...(API_KEY && { 'x-api-key': API_KEY }),
      ...(token && !isPublicEndpoint && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const fullUrl = `${this.baseURL}${endpoint}`
    const response = await fetch(fullUrl, { ...options, headers })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))

      if (response.status === 401 && !isPublicEndpoint) {
        setCachedToken(null)
        localStorage.removeItem('user_brand_id')
        localStorage.removeItem('user_onboarding_completed')
        localStorage.removeItem('user_type_user')
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          setTimeout(() => {
            window.location.href = '/login'
          }, 200)
        }
      }

      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`)
      error.response = { status: response.status, data: errorData }
      throw error
    }

    if (response.status === 204) return null

    const text = await response.text()
    return text ? JSON.parse(text) : null
  }

  get(endpoint) {
    if (endpoint === '/brands' || endpoint.startsWith('/brands?')) {
      throw new Error('GET /brands no está disponible. Este endpoint no existe en el backend.')
    }
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, data) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) })
  }

  patch(endpoint, data) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(data) })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const api = new ApiClient()
