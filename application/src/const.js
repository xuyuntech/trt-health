/* eslint-disable import/prefer-default-export */

const BASE_URL = 'http://localhost:3000/api';

export const API = {
  ArrangementHistory: {
    Create: () => `${BASE_URL}/ArrangementHistory`,
    Query: () => `${BASE_URL}/ArrangementHistory`,
  },
  Hospitals: {
    Query: () => `${BASE_URL}/Hospital`,
    Update: id => `${BASE_URL}/Hospital/${id}`,
    Create: () => `${BASE_URL}/Hospital`,
    FindByID: id => `${BASE_URL}/Hospital/${id}`,
  },
  Doctor: {
    Query: () => `${BASE_URL}/Doctor`,
    Update: id => `${BASE_URL}/Doctor/${id}`,
    Create: () => `${BASE_URL}/Doctor`,
    FindByID: id => `${BASE_URL}/Doctor/${id}`,
  },
  Supplier: {
    Query: () => `${BASE_URL}/Supplier`,
    Update: id => `${BASE_URL}/Supplier/${id}`,
    Create: () => `${BASE_URL}/Supplier`,
    FindByID: id => `${BASE_URL}/Supplier/${id}`,
  },
  MedicalItems: {
    Query: () => `${BASE_URL}/MedicalItem`,
    Update: id => `${BASE_URL}/MedicalItem/${id}`,
    Create: () => `${BASE_URL}/MedicalItem`,
    FindByID: id => `${BASE_URL}/MedicalItem/${id}`,
  },
};
