import { api } from './client';

// Exportar el objeto completo de brands
export const Brands = api.brands;

// Exportar métodos individuales de brands
// Nota: Según el YAML de Insomnia, solo están disponibles create, update (PATCH) y delete
export const createBrand = api.brands.create;
// export const getBrand = api.brands.get; // NO EXISTE en el YAML - comentado para referencia futura
// export const listBrands = api.brands.list; // NO EXISTE en el YAML - comentado para referencia futura
export const updateBrand = api.brands.update; // Usa PATCH según YAML
export const deleteBrand = api.brands.delete;

// Exportar el objeto completo de stores
export const Stores = api.stores;

// Exportar métodos individuales de stores
// Nota: Según el YAML de Insomnia actualizado (2026-02-04):
// - POST /stores (create)
// - GET /stores?brand_id=xxx (list)
// - PATCH /stores/:id (update)
// - DELETE /stores/:id (delete)
export const createStore = api.stores.create;
export const listStores = api.stores.list;
// export const getStore = api.stores.get; // NO EXISTE en el YAML - comentado para referencia futura
export const updateStore = api.stores.update;
export const deleteStore = api.stores.delete;




