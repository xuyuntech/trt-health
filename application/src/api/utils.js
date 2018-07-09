
/* eslint-disable import/prefer-default-export  */

import { BusinessNetworkConnection } from 'composer-client';
import FormData from 'form-data';
import fetch from 'isomorphic-fetch';

import { AdminConnection } from 'composer-admin';
import { IdCard } from 'composer-common';

export const ErrNotFound = { status: 404, err: 'not found' };
export const ErrUnauthorized = { status: 401, err: 'Unauthorized' };
export const ErrInternalServerError = msg => ({ status: 500, err: msg });

export function getFilterParams({
  query = {}, paramsMapFunc, include,
}) {
  const filter = {};
  const where = {};
  const { f } = query;
  if (include === true) {
    filter.include = 'resolve';
  }
  if (f === 'true') {
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
      where[paramName] = typeof fn.getValue === 'function' ? fn.getValue(paramValue) : paramValue;
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
}) {
  const options = {
    method,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'X-Access-Token': req.header('X-Access-Token'),
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
  console.log(`request [${method}]-> ${uri} \n\tparams: ${JSON.stringify(params)} \n\tbody: ${JSON.stringify(body)}`);
  try {
    const res = await fetch(uri, options);
    const data = await res.json();
    console.log(`response -> [${res.status}]:${res.statusText} -> ${JSON.stringify(data)}`);
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


export async function addParticipantIdentity({
  currentCardName, username, accessToken, resourceType, participantData,
}) {
  // const ns = 'org.xuyuntech.health';
  console.log('addParticipantIdentity -->>>', {
    currentCardName, username, accessToken, resourceType,
  });
  const businessNetworkConnection = new BusinessNetworkConnection();
  try {
    // add participant
    const bConnect = await businessNetworkConnection.connect(currentCardName);
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(`org.xuyuntech.health.${resourceType}`);
    const participantExists = await participantRegistry.exists(username);
    console.log(`participant:${resourceType}#${username} exists: ${participantExists}`);
    if (!participantExists) {
      const factory = bConnect.getFactory();
      const participant = factory.newResource('org.xuyuntech.health', resourceType, username);
      Object.assign(participant, participantData);
      // participant.phone = HospitalAdmin.phone;
      await participantRegistry.addAll([participant]);
    } else {
      // console.log(`participant ${username} already exists, start to update.`);
      const participantSaved = await participantRegistry.get(username);
      Object.assign(participantSaved, participantData);
      await participantRegistry.update(participantSaved);
      console.log(`participant ${username} updated successfully.`);
    }
    // get identity, add new one when not exists
    const adminConnection = new AdminConnection();
    const issuingCard = await adminConnection.exportCard('admin@trt-health');
    const result = await businessNetworkConnection.issueIdentity(`org.xuyuntech.health.${resourceType}#${username}`, `${username}-${new Date().getTime()}`, { issuer: true });
    await businessNetworkConnection.disconnect();
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
    console.log(`participant ${username} card exists: ${hasCard}`);
    if (!hasCard) {
      const card = new IdCard(metadata, issuingCard.getConnectionProfile());
      await adminConnection.importCard(cardName, card);
      console.log('import card %s success.', cardName);
      await businessNetworkConnection.connect(cardName);
      const pingResult = await businessNetworkConnection.ping();
      console.log('ping card %s success.', cardName);
      console.log('ping result', pingResult);
      await businessNetworkConnection.disconnect();
    }

    const expCard = await adminConnection.exportCard(cardName);
    const expCardBuffer = await expCard.toArchive({ type: 'nodebuffer' });
    // import card to wallet
    const form = new FormData(); // eslint-disable-line
    form.append('card', expCardBuffer, `${username}.card`);
    form.append('name', `${username}.card`);
    console.log('accessToken', accessToken);
    const importRes = await fetch(`http://localhost:3000/api/wallet/import?name=${cardName}`, {
      method: 'POST',
      headers: {
        'X-Access-Token': accessToken,
      },
      body: form,
    });
    if (importRes.status === 204) {
      console.log('wallet import success', importRes.statusText);
    } else {
      throw new Error(`wallet import failed: ${importRes.statusText}`);
    }
  } catch (error) {
    throw error;
  }
}
