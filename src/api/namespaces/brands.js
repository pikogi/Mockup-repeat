import { buildQueryString } from '../helpers'

export function createBrandsNamespace(client) {
  return {
    create: (brandName, description, ownerId) => {
      return client.post('/brands', { brand_name: brandName, description, owner_id: ownerId })
    },

    get: (brandId) => client.get(`/brands/${brandId}`),

    getPublic: (brandId) => client.publicRequest(`/brands/${brandId}`),

    getUsers: (brandId, { programId, storeId, from, to, cursor, limit, sortBy } = {}) => {
      const qs = buildQueryString({
        program_id: programId,
        store_id: storeId,
        from,
        to,
        cursor,
        limit,
        sort_by: sortBy,
      })
      return client.get(`/brands/${brandId}/users${qs}`)
    },

    getStats: (brandId, { from, to, storeId } = {}) => {
      const qs = buildQueryString({ from, to, store_id: storeId })
      return client.get(`/brands/${brandId}/stats${qs}`)
    },

    getStatsUser: (brandId, userId) => client.get(`/brands/${brandId}/stats/users/${userId}`),

    getStatsUsers: (brandId, { from, to, storeId } = {}) => {
      const qs = buildQueryString({ from, to, store_id: storeId })
      return client.get(`/brands/${brandId}/stats/users${qs}`)
    },

    getStatsTransactions: (brandId, { from, to, storeId } = {}) => {
      const qs = buildQueryString({ from, to, store_id: storeId })
      return client.get(`/brands/${brandId}/stats/transactions${qs}`)
    },

    getStatsRedemptions: (brandId, { from, to, storeId } = {}) => {
      const qs = buildQueryString({ from, to, store_id: storeId })
      return client.get(`/brands/${brandId}/stats/redemptions${qs}`)
    },

    update: (brandId, data) => client.patch(`/brands/${brandId}`, data),

    delete: (brandId) => client.delete(`/brands/${brandId}`),
  }
}
