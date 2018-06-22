import { BusinessNetworkConnection } from 'composer-client';
import { AdminConnection } from 'composer-admin';
import { IdCard } from 'composer-common';
import FormData from 'form-data';
import fetch from 'isomorphic-fetch';
import * as jwt from 'jwt-simple';
import moment from 'moment';
import { participantExists } from './utils';

const express = require('express');

const PORT = 3001;
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const token = 'just4fun';
const APPID = 'wx607464dd2b3f92a5';
// const APPSECRET = 'dbde02a150e545f797727c3995246682';

const REDIRECT_URI = 'http://api.trt-health.xuyuntech.com/auth/wechat/callback';
let server = null;

app.use(cookieParser());
app.use(bodyParser.json());

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

async function addParticipant({
  id, name, address, phone, gender, age,
}) {
  const businessNetworkConnection = new BusinessNetworkConnection();

  try {
    const bConnect = await businessNetworkConnection.connect('admin@trt-health');
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry('org.xuyuntech.health.Patient');
    const factory = bConnect.getFactory();
    const participant = factory.newResource('org.xuyuntech.health', 'Patient', `${id}@trt-health`);
    participant.id = id;
    participant.name = name;
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

app.post('/genToken', (req, res) => {
  const { sid, name } = req.body;
  // gengerate token
  const expires = moment().utc().add({ days: 7 }).unix();
  const jwtToken = jwt.encode({
    exp: expires,
    username: sid,
    realname: name,
  }, 'gSi4WmttWuvy2ewoTGooigPwSDoxwZOy');
  res.redirect(301, `http://localhost:3000/auth/jwt/callback?token=${jwtToken}`);
});

app.get('/register/callback', async (req, res) => {
  res.json({
    accessToken: req.cookies.access_token,
  });
});

app.post('/register', async (req, res) => {
  const { sid, name, accessToken } = req.body;
  const businessNetworkConnection = new BusinessNetworkConnection();
  try {
    const exists = await participantExists(sid, 'org.xuyuntech.health.Patient');
    if (exists === true) {
      res.json({
        status: 1,
        err: `${sid} has exists already`,
      });
      return;
    }
    await addParticipant({ sid, name });
    await businessNetworkConnection.connect('admin@trt-health');
    const adminConnection = new AdminConnection();
    const issuingCard = await adminConnection.exportCard('admin@trt-health');
    // issueIdentity
    const result = await businessNetworkConnection.issueIdentity(`org.xuyuntech.health.Patient#${sid}`, sid);
    console.log('get result success', result);
    console.log(`userID = ${result.userID}`);
    console.log(`userSecret = ${result.userSecret}`);
    await businessNetworkConnection.disconnect();

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
    const cardName = `${sid}@trt-health`;
    // check if card exists
    const hasCard = await adminConnection.hasCard(cardName);
    if (!hasCard) {
      await adminConnection.importCard(cardName, card);
      console.log('import card %s success.', cardName);
    }

    await businessNetworkConnection.connect(cardName);
    const pingResult = await businessNetworkConnection.ping();
    console.log('ping card %s success.', cardName);
    console.log('ping result', pingResult);
    await businessNetworkConnection.disconnect();

    const expCard = await adminConnection.exportCard(cardName);
    const expCardBuffer = await expCard.toArchive({ type: 'nodebuffer' });

    // import card to wallet
    const form = new FormData(); // eslint-disable-line
    form.append('card', expCardBuffer, `${sid}.card`);
    form.append('name', `${sid}.card`);
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
    console.log('identityIssue error:>');
    console.error(error);
    res.json({
      status: 1,
      err: error,
    });
  }
});

app.get('/auth/callback', (req, res) => {
  res.json({
    status: 0,
    data: {
      ...req.query,
    },
  });
});

app.post('/auth/add_participant', async (req, res) => {
  const accessToken = req.header('X-Access-Token');
  console.log('body', req.body, accessToken);
  const {
    userID, nickName, gender, city, avatarUrl,
  } = req.body;
  try {
    await addParticipant({
      id: userID,
      name: nickName,
    });
    console.log('addParticipant success ..');
    await identityIssue(userID, accessToken);
    res.json({
      status: 0,
      data: {
        userID,
        accessToken,
      },
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
