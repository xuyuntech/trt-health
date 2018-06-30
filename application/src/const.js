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
};
