import { buildQueryString } from '../helpers'

export function createLoyaltyProgramsNamespace(client) {
  return {
    list: (brandId, { cursor, limit } = {}) => {
      const qs = buildQueryString({ brand_id: brandId, cursor, limit })
      return client.get(`/loyalty-programs${qs}`)
    },

    listPublic: (brandId) => {
      if (!brandId) return client.publicRequest('/loyalty-programs')
      return client.publicRequest(`/loyalty-programs?brand_id=${brandId}`)
    },

    get: (programId) => client.get(`/loyalty-programs/${programId}`),

    getPublic: (programId) => client.publicRequest(`/loyalty-programs/${programId}`),

    create: (data) => client.post('/loyalty-programs', data),

    update: (programId, data) => client.patch(`/loyalty-programs/${programId}`, data),

    delete: (programId) => client.delete(`/loyalty-programs/${programId}`),
  }
}
