/* eslint-disable import/prefer-default-export */

const BASE_HOST = process.env.NODE_ENV === 'production' ? '10.6.29.108:3000' : 'localhost:3000';
const BASE_URL = `http://${BASE_HOST}/api`; // ? 'http://10.6.29.108:3000/api' : 'http://localhost:3000/api';
const AUTH_URL = `http://${BASE_HOST}`;

export const API = {

  // auth
  Auth: {
    WechatCallback: code => `${AUTH_URL}/auth/wechat/callback?code=${code}`,
  },

  // transaction
  VerifyRegisterAction: {
    Create: () => `${BASE_URL}/VerifyRegisterAction`,
    Query: () => `${BASE_URL}/VerifyRegisterAction`,
    FindByID: id => `${BASE_URL}/VerifyRegisterAction/${id}`,
  },
  FinishRegisterAction: {
    Create: () => `${BASE_URL}/FinishRegisterAction`,
    Query: () => `${BASE_URL}/FinishRegisterAction`,
    FindByID: id => `${BASE_URL}/FinishRegisterAction/${id}`,
  },

  // participant
  Users: {
    FindByID: id => `${BASE_URL}/users/${id}`,
    Login: () => `${BASE_URL}/users/login`,
  },
  Doctor: {
    Query: () => `${BASE_URL}/Doctor`,
    Update: id => `${BASE_URL}/Doctor/${id}`,
    Create: () => `${BASE_URL}/Doctor`,
    Delete: id => `${BASE_URL}/Doctor/${id}`,
    FindByID: id => `${BASE_URL}/Doctor/${id}`,
  },
  HospitalAdmin: {
    Create: () => `${BASE_URL}/HospitalAdmin`,
    Delete: id => `${BASE_URL}/HospitalAdmin/${id}`,
    Query: () => `${BASE_URL}/HospitalAdmin`,
    Update: id => `${BASE_URL}/HospitalAdmin/${id}`,
    FindByID: id => `${BASE_URL}/HospitalAdmin/${id}`,
  },
  Patient: {
    Query: () => `${BASE_URL}/Patient`,
    Create: () => `${BASE_URL}/Patient`,
    FindByID: id => `${BASE_URL}/Patient/${id}`,
  },
  Supplier: {
    Query: () => `${BASE_URL}/Supplier`,
    Update: id => `${BASE_URL}/Supplier/${id}`,
    Create: () => `${BASE_URL}/Supplier`,
    // Delete: id => `${BASE_URL}/Supplier/${id}`,
    FindByID: id => `${BASE_URL}/Supplier/${id}`,
  },

  // asset
  ArrangementHistory: {
    Create: () => `${BASE_URL}/ArrangementHistory`,
    Query: () => `${BASE_URL}/ArrangementHistory`,
    FindByID: id => `${BASE_URL}/ArrangementHistory/${id}`,
  },
  MedicalItems: {
    Query: () => `${BASE_URL}/MedicalItem`,
    Update: id => `${BASE_URL}/MedicalItem/${id}`,
    Create: () => `${BASE_URL}/MedicalItem`,
    FindByID: id => `${BASE_URL}/MedicalItem/${id}`,
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
    Delete: id => `${BASE_URL}/Visitor/${id}`,
    Query: () => `${BASE_URL}/Visitor`,
    FindByID: id => `${BASE_URL}/Visitor/${id}`,
  },
  Hospitals: {
    Query: () => `${BASE_URL}/Hospital`,
    Update: id => `${BASE_URL}/Hospital/${id}`,
    Create: () => `${BASE_URL}/Hospital`,
    Delete: id => `${BASE_URL}/Hospital/${id}`,
    FindByID: id => `${BASE_URL}/Hospital/${id}`,
  },
  Prescription: {
    Create: () => `${BASE_URL}/Prescription`,
    Query: () => `${BASE_URL}/Prescription`,
    FindByID: id => `${BASE_URL}/Prescription/${id}`,
  },
  CaseItem: {
    Create: () => `${BASE_URL}/CaseItem`,
    Query: () => `${BASE_URL}/CaseItem`,
    FindByID: id => `${BASE_URL}/CaseItem/${id}`,
  },
  Order: {
    Create: () => `${BASE_URL}/Order`,
    Query: () => `${BASE_URL}/Order`,
    FindByID: id => `${BASE_URL}/Order/${id}`,
  },
  OrderItem: {
    Create: () => `${BASE_URL}/OrderItem`,
    Query: () => `${BASE_URL}/OrderItem`,
    FindByID: id => `${BASE_URL}/OrderItem/${id}`,
  },
  PaymentHistory: {
    Create: () => `${BASE_URL}/PaymentHistory`,
    Query: () => `${BASE_URL}/PaymentHistory`,
    FindByID: id => `${BASE_URL}/PaymentHistory/${id}`,
  },
  OutboundHistory: {
    Create: () => `${BASE_URL}/OutboundHistory`,
    Query: () => `${BASE_URL}/OutboundHistory`,
    FindByID: id => `${BASE_URL}/OutboundHistory/${id}`,
  },
};
