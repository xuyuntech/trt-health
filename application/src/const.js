/* eslint-disable import/prefer-default-export */

const BASE_URL = 'http://localhost:3000/api';

export const API = {
  Hospitals: {
    Query: () => `${BASE_URL}/Hospital`,
    Create: () => `${BASE_URL}/Hospital`,
    FindByID: id => `${BASE_URL}/Hospital/${id}`,
  },
};
