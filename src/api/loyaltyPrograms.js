import { api } from './client';

// Exportar el objeto completo de loyaltyPrograms
export const LoyaltyPrograms = api.loyaltyPrograms;

// Exportar métodos individuales de loyaltyPrograms
export const listLoyaltyPrograms = api.loyaltyPrograms.list;
export const listLoyaltyProgramsPublic = api.loyaltyPrograms.listPublic;
export const getLoyaltyProgram = api.loyaltyPrograms.get;
export const getLoyaltyProgramPublic = api.loyaltyPrograms.getPublic;
export const createLoyaltyProgram = api.loyaltyPrograms.create;
export const updateLoyaltyProgram = api.loyaltyPrograms.update;
export const deleteLoyaltyProgram = api.loyaltyPrograms.delete;
