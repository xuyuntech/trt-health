import { BusinessNetworkConnection } from 'composer-client';
import { AdminConnection } from 'composer-admin';
import { IdCard } from 'composer-common';
import FormData from 'form-data';
import fetch from 'isomorphic-fetch';

const express = require('express');

const PORT = 3001;
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const app = express();
const token = 'just4fun';
const APPID = 'wx607464dd2b3f92a5';
// const APPSECRET = 'dbde02a150e545f797727c3995246682';

const REDIRECT_URI = 'http://api.trt-health.xuyuntech.com/auth/wechat/callback';
let server = null;

app.use(cookieParser());

app.get('/', (req, res) => {
  res.end('<h1>Test ...</h1>');
});
app.get('/auth/wechat', (req, res) => {
  res.redirect(302, `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`);
});
app.get('/auth/wechat/callback/MP_verify_VffFlC9IPbnij9I9.txt', (req, res) => {
  res.sendfile('./MP_verify_VffFlC9IPbnij9I9.txt');
});
app.get('/wx_callback', (req, res) => {
  const {
    timestamp, nonce, signature, echostr,
  } = req.query;
  const shasum = crypto.createHash('sha1');
  const secret = shasum.update([token, timestamp, nonce].sort().join('')).digest('hex');
  if (secret === signature) {
    res.end(echostr);
  } else {
    res.end('error');
  }
});

async function addParticipant(userID) {
  const businessNetworkConnection = new BusinessNetworkConnection();

  try {
    const bConnect = await businessNetworkConnection.connect('admin@trt-health');
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.xuyuntech.health.Patient');
    const factory = bConnect.getFactory();
    const participant = factory.newResource('org.xuyuntech.health', 'Patient', `${userID}@trt-health`);
    participant.sid = userID;
    participant.name = 'test name';
    participant.address = 'test address';
    participant.phone = 'test phone';
    participant.gender = 'MALE';
    participant.age = 20;
    await participantRegistry.add(participant);
    await businessNetworkConnection.disconnect();
    console.log('addPaticipange done');
  } catch (error) {
    console.log('addPaticipant error:>');
    console.error(error);
    throw error;
  }
}

async function identityIssue(userID, accessToken) {
  const businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect('admin@trt-health');
    const adminConnection = new AdminConnection();
    const issuingCard = await adminConnection.exportCard('admin@trt-health');
    // issueIdentity
    const result = await businessNetworkConnection.issueIdentity(`org.xuyuntech.health.Patient#${userID}`, userID);
    console.log('get result success');
    // get card buffer
    const metadata = {
      userName: result.userID,
      version: 1,
      enrollmentSecret: result.userSecret,
      businessNetwork: issuingCard.getBusinessNetworkName(),
    };
    const card = new IdCard(metadata, issuingCard.getConnectionProfile());
    const cardBuffer = await card.toArchive({ type: 'nodebuffer' });
    // import card to composer
    const cardName = `${userID}@trt-health`;
    // check if card exists
    const hasCard = await adminConnection.hasCard(cardName);
    if (!hasCard) {
      await adminConnection.importCard(cardName, card);
      console.log('import card %s success.', cardName);
    }
    // import card to wallet
    const form = new FormData(); // eslint-disable-line
    form.append('card', cardBuffer, `${userID}.card`);
    const res = await fetch(`http://localhost:3000/api/wallet/import?name=${cardName}`, {
      method: 'POST',
      headers: {
        'X-Access-Token': accessToken,
      },
      body: form,
    });
    if (res.status === 204) {
      console.log('wallet import success', res.statusText);
    } else {
      throw new Error(`wallet import failed: ${res.statusText}`);
    }

    console.log('result', result);
    console.log(`userID = ${result.userID}`);
    console.log(`userSecret = ${result.userSecret}`);
    await businessNetworkConnection.disconnect();
  } catch (error) {
    console.log('identityIssue error:>');
    console.error(error);
    throw error;
  }
}

// async function importCard({ userID, accessToken }) {
//   try {
//     await fetch('http://106.75.52.85:3000/wallet/import', {
//       method: 'POST',
//       body: JSON.stringify({
//         card: '',
//         name: '',
//       }),
//       headers: {
//         'X-Access-Token': accessToken,
//       },
//     });
//   } catch (error) {
//     throw error;
//   }
// }

app.get('/auth/add_paticipant', async (req, res) => {
  const accessToken = req.query['access-token'];
  const userID = req.query['user-id'];
  console.log('query', { accessToken, userID });
  try {
    await addParticipant(userID);
    console.log('addParticipant success ..');
    await identityIssue(userID, accessToken);
    res.json({
      status: 0,
    });
  } catch (err) {
    res.json({
      status: 1,
      err,
    });
  }
});

server = app.listen(PORT, '0.0.0.0', () => {
  const { address, port } = server.address();
  console.log('Example app listening at http://%s:%s', address, port);
});
