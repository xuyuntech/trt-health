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
  PayRegisterAction: {
    Create: () => `${BASE_URL}/PayRegisterAction`,
    Query: () => `${BASE_URL}/PayRegisterAction`,
    FindByID: id => `${BASE_URL}/PayRegisterAction/${id}`,
  },
  FinishRegisterAction: {
    Create: () => `${BASE_URL}/FinishRegisterAction`,
    Query: () => `${BASE_URL}/FinishRegisterAction`,
    FindByID: id => `${BASE_URL}/FinishRegisterAction/${id}`,
  },
  PayAction: {
    Create: () => `${BASE_URL}/PayAction`,
    Query: () => `${BASE_URL}/PayAction`,
    FindByID: id => `${BASE_URL}/PayAction/${id}`,
  },
  FinishAction: {
    Create: () => `${BASE_URL}/FinishAction`,
    Query: () => `${BASE_URL}/FinishAction`,
    FindByID: id => `${BASE_URL}/FinishAction/${id}`,
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
    FindByID: id => `${BASE_URL}/Doctor/${id}`,
  },
  HospitalAdmin: {
    Create: () => `${BASE_URL}/HospitalAdmin`,
    Query: () => `${BASE_URL}/HospitalAdmin`,
    Update: id => `${BASE_URL}/HospitalAdmin/${id}`,
    FindByID: id => `${BASE_URL}/HospitalAdmin/${id}`,
  },

  // asset
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
};
