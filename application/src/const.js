/* eslint-disable import/prefer-default-export */

import { RestServerConfig } from './config';

const { httpURL } = RestServerConfig;

// const BASE_HOST = process.env.NODE_ENV === 'production' ? '10.6.29.108:3000' : 'localhost:3000';
const BASE_URL = `http://${httpURL}/api`; // ? 'http://10.6.29.108:3000/api' : 'http://localhost:3000/api';
const AUTH_URL = `http://${httpURL}`;
const TENCENT_URL = 'https://console.tim.qq.com';

export const HospitalGrade = {
  ThirdSpecial: '三级特等', // 三级特等
  ThridA: '三级甲等', // 三级甲等，下面以此类推
  ThridB: '三级乙等',
  ThirdC: '三级丙等',
  SecondA: '二级甲等',
  SecondB: '二级乙等',
  SecondC: '二级丙等',
  FirstA: '一级甲等',
  FirstB: '一级乙等',
  FirstC: '一级甲等',
};

export const API = {

  // auth
  Auth: {
    WechatCallback: code => `${AUTH_URL}/auth/wechat/callback?code=${code}`,
  },

  Wallet: {
    Import: cardName => `${BASE_URL}/wallet/import?name=${cardName}`,
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
    FindOne: () => `${BASE_URL}/users/findOne`,
    ResetPassword: () => `${BASE_URL}/users/reset-password`,
    Login: () => `${BASE_URL}/users/login`,
    Logout: () => `${BASE_URL}/users/logout`,
    Create: () => `${BASE_URL}/users`,
    Update: id => `${BASE_URL}/users/${id}`,
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
    FindByName: name => `${BASE_URL}/HospitalAdmin/${name}`,
  },
  OrgAdmin: {
    Create: () => `${BASE_URL}/OrgAdmin`,
    Query: () => `${BASE_URL}/OrgAdmin`,
    Update: id => `${BASE_URL}/OrgAdmin/${id}`,
    FindByName: name => `${BASE_URL}/OrgAdmin/${name}`,
  },

  // asset
  ArrangementHistory: {
    Create: () => `${BASE_URL}/ArrangementHistory`,
    Query: () => `${BASE_URL}/ArrangementHistory`,
    FindByID: id => `${BASE_URL}/ArrangementHistory/${id}`,
    Cancel: () => `${BASE_URL}/OperateArrangementAction`,
  },
  RegisterHistory: {
    Create: () => `${BASE_URL}/RegisterHistory`,
    Query: () => `${BASE_URL}/RegisterHistory`,
    FindByID: id => `${BASE_URL}/RegisterHistory/${id}`,
  },
  Department: {
    Init: () => `${BASE_URL}/InitDepartment`,
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
  Order: {
    Register: () => `${BASE_URL}/InitRegisterAction`,
  },
  Visitor: {
    Create: () => `${BASE_URL}/Visitor`,
    Query: () => `${BASE_URL}/Visitor`,
    FindByID: id => `${BASE_URL}/Visitor/${id}`,
    Update: id => `${BASE_URL}/Visitor/${id}`,
    DeleteByID: id => `${BASE_URL}/Visitor/${id}`,
  },
  Hospitals: {
    Query: () => `${BASE_URL}/Hospital`,
    Update: id => `${BASE_URL}/Hospital/${id}`,
    Create: () => `${BASE_URL}/Hospital`,
    FindByID: id => `${BASE_URL}/Hospital/${id}`,
    Delete: id => `${BASE_URL}/Hospital/${id}`,
  },
  Imtencent: {
    Url: (servicename, command, sdkappid, usersig) => `${TENCENT_URL}/v4/${servicename}/${command}?sdkappid=${sdkappid}&identifier=admin&usersig=${usersig}&random=99999999&contenttype=json`,
  },
};
