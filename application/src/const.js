/* eslint-disable import/prefer-default-export */

import config from './config';

const { restServerConfig } = config;
const { httpURL } = restServerConfig;

// const BASE_HOST = process.env.NODE_ENV === 'production' ? '10.6.29.108:3000' : 'localhost:3000';
const BASE_URL = `http://${httpURL}/api`; // ? 'http://10.6.29.108:3000/api' : 'http://localhost:3000/api';
const AUTH_URL = `http://${httpURL}`;

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
  Patient: {
    Query: () => `${BASE_URL}/Patient`,
    Update: name => `${BASE_URL}/Patient/${name}`,
    Create: () => `${BASE_URL}/Patient`,
    FindByName: name => `${BASE_URL}/Patient/${name}`,
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
