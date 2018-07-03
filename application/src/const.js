/* eslint-disable import/prefer-default-export */

const BASE_URL = 'http://localhost:3000/api';

export const API = {
  ArrangementHistory: {
    Create: () => `${BASE_URL}/ArrangementHistory`,
    Query: () => `${BASE_URL}/ArrangementHistory`,
    FindByID: id => `${BASE_URL}/ArrangementHistory/${id}`,
  },
  RegisterHistory: {
    Create: () => `${BASE_URL}/RegisterHistory`,
    Query: () => `${BASE_URL}/RegisterHistory`,
    FindByID: id => `${BASE_URL}/RegisterHistory/${id}`,
  },
  Department1: {
    Create: () => `${BASE_URL}/Department1`,
    Delete: id => `${BASE_URL}/Department1/${id}`,
    Query: () => `${BASE_URL}/Department1`,
    FindByID: id => `${BASE_URL}/Department1/${id}`,
  },
  Department2: {
    Create: () => `${BASE_URL}/Department2`,
    Delete: id => `${BASE_URL}/Department2/${id}`,
    Query: () => `${BASE_URL}/Department2`,
    FindByID: id => `${BASE_URL}/Department2/${id}`,
  },
  Visitor: {
    Create: () => `${BASE_URL}/Visitor`,
    Query: () => `${BASE_URL}/Visitor`,
    FindByID: id => `${BASE_URL}/Visitor/${id}`,
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
