// API Client principal
export { api } from './client';

// Auth
export { User } from './entities';

// Health
export { Health, healthCheck } from './health';

// Brands
export { Brands, createBrand, updateBrand, deleteBrand } from './brands';

// Stores (exportados desde brands.js)
export { Stores, listStores, createStore, updateStore, deleteStore } from './brands';

// Loyalty Programs
export {
  LoyaltyPrograms,
  listLoyaltyPrograms,
  listLoyaltyProgramsPublic,
  getLoyaltyProgram,
  getLoyaltyProgramPublic,
  createLoyaltyProgram,
  updateLoyaltyProgram,
  deleteLoyaltyProgram,
} from './loyaltyPrograms';

// Loyalty Cards
export {
  LoyaltyCards,
  createLoyaltyCard,
  getLoyaltyCard,
  getLoyaltyCardPublic,
} from './loyaltyCards';

// Transactions
export { Transactions, createTransaction } from './transactions';

// Images
export { Images, createStampCard } from './images';
