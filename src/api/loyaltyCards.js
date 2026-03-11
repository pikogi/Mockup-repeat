import { api } from './client';

// Exportar el objeto completo de loyaltyCards
export const LoyaltyCards = api.loyaltyCards;

// Exportar métodos individuales de loyaltyCards
// Nota: Según el YAML de Insomnia, list/update/delete están marcados como TBD
export const createLoyaltyCard = api.loyaltyCards.create;
export const getLoyaltyCard = api.loyaltyCards.get;
export const getLoyaltyCardPublic = api.loyaltyCards.getPublic;
// export const listLoyaltyCards = api.loyaltyCards.list; // TBD en el backend
// export const updateLoyaltyCard = api.loyaltyCards.update; // TBD en el backend
// export const deleteLoyaltyCard = api.loyaltyCards.delete; // TBD en el backend
