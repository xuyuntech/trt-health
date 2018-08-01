
/* eslint-disable import/prefer-default-export  */

import { BusinessNetworkConnection } from 'composer-client';
import FormData from 'form-data';
import fetch from 'isomorphic-fetch';
import moment from 'moment';

import { AdminConnection } from 'composer-admin';
import { IdCard } from 'composer-common';
import { API } from '../const';

export const ErrNotFound = { status: 404, err: 'not found' };
export const ErrNoContent = { status: 204, err: 'no content' };
export const ErrUnauthorized = { status: 401, err: 'Unauthorized' };
export const ErrInternalServerError = msg => ({ status: 500, err: msg });

// 获取各种单据的编号
export function getNumber(type) {
  const now = moment().format('YYYYMMDDhhmm');
  const rand = Math.ceil(Math.random() * 10000);
  switch (type) {
    case 'RegisterHistory':
      return `RH${now}${rand}`;
    default:
      return '';
  }
}

export function getFilterParams({
  query = {}, paramsMapFunc = {}, include = false,
}) {
  const filter = {};
  const where = {};
  const { f } = query;
  if (include === true) {
    filter.include = 'resolve';
  }
  if (f === 'true') {
    const { order, limit, skip } = query;
    console.log(`order:${order}, limit:${limit}, skip:${skip}`);
    filter.order = order;
    filter.limit = limit;
    filter.skip = skip;
    const keys = Object.keys(paramsMapFunc);
    for (let i = 0; i < keys.length; i += 1) {
      const paramName = keys[i];
      const paramValue = query[paramName];
      console.log(paramName, paramValue);
      const fn = paramsMapFunc[paramName];
      if (typeof fn === 'function') {
        const validateResult = fn.call(null, paramValue);
        if (validateResult && validateResult.err) {
          return {
            filter: null,
            err: validateResult.err,
          };
        }
      } else if (typeof fn === 'object' && fn.test) {
        // required 校验
        if (fn.test === 'required' && !paramValue) {
          return {
            filter: null,
            err: fn.errMsg || `${paramName} is required`,
          };
        // 正则校验
        } else if (Object.prototype.toString.call(fn.test) === '[object RegExp]' && !fn.test(paramValue)) {
          return {
            filter: null,
            err: fn.errMsg || `${paramName} validation failed`,
          };
        }
      }
      // 校验数据类型
      if (typeof fn === 'object' && fn.type) {
        let validValue = true;
        switch (fn.type) {
          case 'date':
            validValue = /^\d{4}-\d{2}-\d{2}$/.test(paramValue);
            break;
          case 'number':
            validValue = !isNaN(paramValue); //eslint-disable-line
            break;
          default:
        }
        if (!validValue) {
          console.warn(`request param value invalid: ${paramName}:${paramValue}`);
          continue; //eslint-disable-line
        }
      }
      if (paramValue) {
        where[paramName] = typeof fn.getValue === 'function' ? fn.getValue(paramValue) : paramValue;
      }
    }

    if (Object.keys(where).length > 0) {
      filter.where = where;
    }
    return {
      filter,
      err: null,
    };
  }
  return {
    filter: null,
    err: null,
  };
}


export async function bfetch(url, {
  req, method = 'GET', headers = {}, body = {}, params = {},
} = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Access-Token': req ? req.header('X-Access-Token') : '',
      ...headers,
    },
    // body: JSON.stringify(body),
  };
  let uri = url;
  if (method === 'GET') {
    const paramStr = Object.keys(params).map(k => `${k}=${encodeURIComponent(params[k])}`).join('&');
    if (paramStr) {
      uri += (url.indexOf('?') >= 0 ? '&' : '?') + paramStr;
    }
  } else {
    options.body = JSON.stringify(body);
  }
  console.log('----------->>>');
  console.log(`request [${method}]-> ${uri} \n\tparams: ${JSON.stringify(params)} \n\tbody: ${JSON.stringify(body)} \n\theaders: ${JSON.stringify(options.headers)}`);
  try {
    const res = await fetch(uri, options);
    if (res.status === 204) {
      if (method === 'DELETE') {
        return {};
      }
      throw ErrNoContent;
    }
    console.log(`response -> [${res.status}]:${res.statusText}]`);
    const data = await res.json();
    console.log(`response body -> ${JSON.stringify(data)}`);
    console.log('<<<-----------');
    if (res.status === 404) {
      throw ErrNotFound;
    }
    if (res.status === 401) {
      throw ErrUnauthorized;
    }
    if (res.status === 500) {
      console.log('request 500:>', data);
      if (data && data.error) {
        const msg = data.error;
        if (msg === 'A business network card has not been specified') {
          throw ErrUnauthorized;
        } else {
          throw ErrInternalServerError(msg);
        }
      } else {
        throw ErrInternalServerError(data);
      }
    }
    if (res.status !== 200) {
      const err = {
        status: res.status,
        err: res.statusText,
      };
      throw err;
    }
    return data;
  } catch (err) {
    throw err;
  }
}

const ns = 'org.xuyuntech.health';


export async function checkUserLogin({ username, resourceType }) {
  const businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect('admin@trt-health');
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(`org.xuyuntech.health.${resourceType}`);
    const exists = await participantRegistry.exists(username);
    await businessNetworkConnection.disconnect();
    console.log(exists);
    return exists;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export class Ticker {
  start() {
    this.t = new Date();
    return this;
  }
  getDuration(t, type = 'seconds') {
    const d = t.getTime() - this.t.getTime();
    switch (type) {
      case 'seconds':
        return Number.prototype.toFixed.call(d / 1000, 3);
      default:
        return 0;
    }
  }
  tick(msg) {
    const t = new Date();
    console.log(`${msg}: ${this.getDuration(t)}`);
    this.t = t;
    return this;
  }
}

export async function addParticipantIdentity({
  currentCardName, username, accessToken, resourceType, participantData = {},
}) {
  const ticker = new Ticker().start();
  const tTicker = new Ticker().start();
  console.log('addParticipantIdentity -->>>', {
    currentCardName, username, accessToken, resourceType,
  });
  const businessNetworkConnection = new BusinessNetworkConnection();
  try {
    // add participant
    const bConnect = await businessNetworkConnection.connect(currentCardName);
    ticker.tick('businessNetworkConnection.connect');
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(`org.xuyuntech.health.${resourceType}`);
    ticker.tick('businessNetworkConnection.getParticipantRegistry');
    const participantExists = await participantRegistry.exists(username);
    ticker.tick('participantRegistry.exists');
    console.log(`participant:${resourceType}#${username} exists: ${participantExists}`);
    const factory = bConnect.getFactory();
    if (!participantExists) {
      const participant = factory.newResource('org.xuyuntech.health', resourceType, username);
      Object.keys(participantData).forEach((k) => {
        let item = participantData[k];
        if (item && item.relation === true && item.type && item.id) {
          item = factory.newRelationship(ns, item.type, item.id);
        }
        participant[k] = item;
      });
      // participant.phone = HospitalAdmin.phone;
      await participantRegistry.addAll([participant]);
      ticker.tick('participantRegistry.addAll');
    } else {
      // console.log(`participant ${username} already exists, start to update.`);
      const participantSaved = await participantRegistry.get(username);
      // Object.assign(participantSaved, participantData);
      Object.keys(participantData).forEach((k) => {
        let item = participantData[k];
        if (item && item.relation === true && item.type && item.id) {
          item = factory.newRelationship(ns, item.type, item.id);
        }
        participantSaved[k] = item;
      });
      await participantRegistry.update(participantSaved);
      ticker.tick('participantRegistry.update');
      console.log(`participant ${username} updated successfully.`);
    }
    // get identity, add new one when not exists
    const adminConnection = new AdminConnection();
    const issuingCard = await adminConnection.exportCard('admin@trt-health');
    ticker.tick('adminConnection.exportCard');
    const result = await businessNetworkConnection.issueIdentity(`org.xuyuntech.health.${resourceType}#${username}`, `${username}-${new Date().getTime()}`, { issuer: true });
    ticker.tick('businessNetworkConnection.issueIdentity');
    await businessNetworkConnection.disconnect();
    ticker.tick('businessNetworkConnection.disconnect');
    console.log('issueIdentity result', result);
    const metadata = {
      userName: result.userID,
      version: 1,
      enrollmentSecret: result.userSecret,
      businessNetwork: issuingCard.getBusinessNetworkName(),
    };
    // issueIdentity
    const cardName = `${username}@trt-health`;
    const hasCard = await adminConnection.hasCard(cardName);
    ticker.tick('adminConnection.hasCard');
    console.log(`participant ${username} card exists: ${hasCard}`);
    if (hasCard) {
      await adminConnection.deleteCard(cardName);
      ticker.tick('adminConnection.deleteCard');
    }
    const card = new IdCard(metadata, issuingCard.getConnectionProfile());
    await adminConnection.importCard(cardName, card);
    ticker.tick('adminConnection.importCard');
    console.log('import card %s success.', cardName);
    await businessNetworkConnection.connect(cardName);
    ticker.tick(`adminConnection.connect ${cardName}`);
    const pingResult = await businessNetworkConnection.ping();
    ticker.tick('businessNetworkConnection.ping');
    console.log('ping card %s success.', cardName);
    console.log('ping result', pingResult);
    await businessNetworkConnection.disconnect();
    ticker.tick('businessNetworkConnection.disconnect');
    const expCard = await adminConnection.exportCard(cardName);
    ticker.tick('adminConnection.exportCard');
    const expCardBuffer = await expCard.toArchive({ type: 'nodebuffer' });
    ticker.tick('expCard.toArchive');
    // import card to wallet
    const form = new FormData(); // eslint-disable-line
    form.append('card', expCardBuffer, `${username}.card`);
    form.append('name', `${username}.card`);
    console.log('accessToken', accessToken);
    const importRes = await fetch(API.Wallet.Import(cardName), {
      method: 'POST',
      headers: {
        'X-Access-Token': accessToken,
      },
      body: form,
    });
    ticker.tick('wallet import');
    tTicker.tick('----> Whole process cost');
    if (importRes.status === 204) {
      console.log('wallet import success', importRes.statusText);
    } else {
      throw new Error(`wallet import failed: ${importRes.statusText}`);
    }
  } catch (error) {
    console.error('addParticipantIdentity err: ', error);
    throw error;
  }
}
