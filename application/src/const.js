/* eslint-disable import/prefer-default-export */

const BASE_URL = 'http://localhost:3000/api';

export const API = {
  ArrangementHistory: {
    Create: () => `${BASE_URL}/ArrangementHistory`,
    Query: () => `${BASE_URL}/ArrangementHistory`,
    FindByID: id => `${BASE_URL}/ArrangementHistory/${id}`,
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
  Patient: {
    Query: () => `${BASE_URL}/Patient`,
    Update: id => `${BASE_URL}/Patient/${id}`,
    Create: () => `${BASE_URL}/Patient`,
    FindByID: id => `${BASE_URL}/Patient/${id}`,
  },
  Supplier: {
    Query: () => `${BASE_URL}/Supplier`,
    Update: id => `${BASE_URL}/Supplier/${id}`,
    Create: () => `${BASE_URL}/Supplier`,
    FindByID: id => `${BASE_URL}/Supplier/${id}`,
  },
  Visitor: {
    Create: () => `${BASE_URL}/Visitor`,
    Query: () => `${BASE_URL}/Visitor`,
    FindByID: id => `${BASE_URL}/Visitor/${id}`,
  },
  MedicalItems: {
    Query: () => `${BASE_URL}/MedicalItem`,
    Update: id => `${BASE_URL}/MedicalItem/${id}`,
    Create: () => `${BASE_URL}/MedicalItem`,
    FindByID: id => `${BASE_URL}/MedicalItem/${id}`,
  },
  RegisterHistory: {
    Query: () => `${BASE_URL}/RegisterHistory`,
    Update: id => `${BASE_URL}/RegisterHistory/${id}`,
    Create: () => `${BASE_URL}/RegisterHistory`,
    FindByID: id => `${BASE_URL}/RegisterHistory/${id}`,
  },
  CaseItem: {
    Create: () => `${BASE_URL}/CaseItem`,
    Query: () => `${BASE_URL}/CaseItem`,
    FindByID: id => `${BASE_URL}/CaseItem/${id}`,
  },
};
