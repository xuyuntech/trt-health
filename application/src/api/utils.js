
/* eslint-disable import/prefer-default-export  */

import { BusinessNetworkConnection } from 'composer-client';
import FormData from 'form-data';
import fetch from 'isomorphic-fetch';

import { AdminConnection } from 'composer-admin';
import { IdCard } from 'composer-common';

export const ErrNotFound = { status: 404, err: 'not found' };
export const ErrUnauthorized = { status: 401, err: 'Unauthorized' };

export async function bfetch(url, {
  req, method = 'GET', headers, body,
}) {
  try {
    const res = await fetch(url, {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'X-Access-Token': req.header('X-Access-Token'),
      },
      body: JSON.stringify(body),
    });
    if (res.status === 404) {
      throw ErrNotFound;
    }
    if (res.status === 401) {
      throw ErrUnauthorized;
    }
    if (res.status !== 200) {
      const err = {
        status: res.status,
        err: res.statusText,
      };
      throw err;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
}


export async function addParticipantIdentity({
  currentCardName, username, accessToken, resourceType,
}) {
  console.log('addParticipantIdentity -->>>', {
    currentCardName, username, accessToken, resourceType,
  });
  const businessNetworkConnection = new BusinessNetworkConnection();
  try {
    // add participant
    const bConnect = await businessNetworkConnection.connect(currentCardName);
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(`org.xuyuntech.health.${resourceType}`);
    const adminExists = await participantRegistry.exists(username);
    if (!adminExists) {
      const factory = bConnect.getFactory();
      const participant = factory.newResource('org.xuyuntech.health', resourceType, username);
      // participant.phone = HospitalAdmin.phone;
      await participantRegistry.addAll([participant]);
    } else {
      console.log(`participant ${username} already exists, ignore.`);
    }
    // identityIssue
    const adminConnection = new AdminConnection();
    const cardName = `${username}@trt-health`;
    const hasCard = await adminConnection.hasCard(cardName);
    if (!hasCard) {
      const issuingCard = await adminConnection.exportCard('admin@trt-health');
      const result = await businessNetworkConnection.issueIdentity(`org.xuyuntech.health.${resourceType}#${username}`, username, { issuer: true });
      await businessNetworkConnection.disconnect();
      console.log('issueIdentity result', result);
      const metadata = {
        userName: result.userID,
        version: 1,
        enrollmentSecret: result.userSecret,
        businessNetwork: issuingCard.getBusinessNetworkName(),
      };
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
