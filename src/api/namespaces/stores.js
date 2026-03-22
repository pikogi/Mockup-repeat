import { buildQueryString } from '../helpers'

export function createStoresNamespace(client) {
  return {
    list: (brandId, { cursor, limit } = {}) => {
      const qs = buildQueryString({ brand_id: brandId, cursor, limit })
      return client.get(`/stores${qs}`)
    },

    create: (brandId, storeName, address, city, latitude, longitude) => {
      const body = { brand_id: brandId, store_name: storeName }
      if (address) body.address = address
      if (city) body.city = city
      if (latitude && longitude) {
        body.latitude = parseFloat(latitude)
        body.longitude = parseFloat(longitude)
      }
      return client.post('/stores', body)
    },

    update: (storeId, data) => client.patch(`/stores/${storeId}`, data),

    delete: (storeId) => client.delete(`/stores/${storeId}`),
  }
}
