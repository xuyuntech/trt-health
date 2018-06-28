import express from 'express';
import { BusinessNetworkConnection } from 'composer-client';
import moment from 'moment';
import * as jwt from 'jwt-simple';
import FormData from 'form-data';

import { AdminConnection } from 'composer-admin';
import { IdCard } from 'composer-common';
import fetch from 'isomorphic-fetch';

// userID = bjtrt-ts01
// userSecret = kZYafhQWZnMw

const router = express.Router();

const hospitals = [
  {
    name: '北京同仁堂唐山中医医院',
    address: '唐山市路北区河东路三益楼5-12号',
    phone1: '0575',
    phone2: '5918781',
    zipCode: '1000000',
    headImg: 'http://img.yzcdn.cn/upload_files/2018/06/22/FjZ-FCkMjTt03zswL6gpjw3MohNP.png',
  },
];
const doctors = [
  {
    name: '王志国',
    phone: '18699880099',
    sid: '57839393938484040293',
    email: '',
    address: '',
    birthday: '',
    avatar: 'http://www.jf258.com/uploads/2013-12-31/020200285.jpg',
    gender: 'MALE',
    age: 40,
    title: '主任医师',
    description: '北京专家，医学博士，博士后，研究员，现任职于中国中医科学院',
    skilledIn: '治疗内科、妇科以及外科等疾病',
  },
  {
    name: '路广林',
    phone: '18699880099',
    sid: '57839393938484012333',
    email: '',
    address: '',
    birthday: '',
    avatar: 'http://www.jf258.com/uploads/2013-12-31/020200285.jpg',
    gender: 'FEMALE',
    age: 45,
    title: '主任医师',
    description: '北京专家，医学博士，教授，毕业于北京中医药大学',
    skilledIn: '内科，妇科，皮外科，儿科',
  },
];

const HospitalAdmin = {
  name: 'bjtrt-ts05',
  phone: '18618441311',
};

router.get('/auth_success', (req, res) => {
  res.json({
    status: 0,
    result: req.query,
    cookies: req.cookies,
  });
});

router.get('/genJwtToken', async (req, res) => {
  if (!req.query.username) {
    res.json({
      status: 1,
      err: 'need username',
    });
    return;
  }
  const expires = moment().utc().add({ days: 7 }).unix();
  const jwtToken = jwt.encode({
    exp: expires,
    system: 'admin', // admin | client | reg
    username: req.query.username,
  }, 'gSi4WmttWuvy2ewoTGooigPwSDoxwZOy');
  const res1 = await fetch(`http://localhost:3000/auth/jwt/callback?token=${jwtToken}`);
  const result = await res1.json();
  res.json(result);
});

async function addParticipantIdentity({
  currentCardName, username, accessToken, resourceType,
}) {
  const businessNetworkConnection = new BusinessNetworkConnection();
  try {
    // add participant
    const bConnect = await businessNetworkConnection.connect(currentCardName);
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(`org.xuyuntech.health.${resourceType}`);
    const adminExists = await participantRegistry.exists(username);
    if (!adminExists) {
      const factory = bConnect.getFactory();
      const participant = factory.newResource('org.xuyuntech.health', resourceType, username);
      participant.phone = HospitalAdmin.phone;
      await participantRegistry.addAll([participant]);
    } else {
      console.log(`participant ${username} already exists, ignore.`);
    }
    // identityIssue
    const adminConnection = new AdminConnection();
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
    const cardName = `${username}@trt-health`;
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

router.get('/auth/wechat/success', async (req, res) => {
  const accessToken = req.query['access-token'];
  const userID = req.query['user-id'];
  try {
    const currentUserRes = await fetch(`http://localhost:3000/api/users/${userID}`, { headers: { 'X-Access-Token': accessToken } });
    if (currentUserRes.status !== 200) {
      throw new Error(`get current user failed: ${currentUserRes.statusText}`);
    }
    const currentUser = await currentUserRes.json();
    const currentCardName = `${currentUser.username}@trt-health`;
    await addParticipantIdentity({
      currentCardName: 'admin@trt-health', username: currentUser.username, accessToken, resourceType: 'Patient',
    });
    console.log('add Patient done');
    res.json({
      status: 0,
      result: {
        accessToken,
        userID,
      },
    });
  } catch (error) {
    console.log(`add Patient error:> ${error}`);
    res.json({
      status: 1,
      err: `${error}`,
    });
  }
});

router.post('/hospitalAdmin', async (req, res) => {
  const { username, password, email } = req.body;
  const accessToken = req.header('X-Access-Token');
  const userID = req.header('X-Access-USERID');
  try {
    const currentUserRes = await fetch(`http://localhost:3000/api/users/${userID}`, { headers: { 'X-Access-Token': accessToken } });
    if (currentUserRes.status !== 200) {
      throw new Error(`get current user failed: ${currentUserRes.statusText}`);
    }
    const currentUser = await currentUserRes.json();
    const currentCardName = `${currentUser.username}@trt-health`;
    // add user
    const addUserRes = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email,
      }),
    });
    if (addUserRes.status !== 200) {
      throw new Error(`add user failed: ${addUserRes.statusText}`);
    }
    await addParticipantIdentity({
      currentCardName, username, accessToken, resourceType: 'HospitalAdmin',
    });
    console.log('add hospitalAdmin done');
    res.json({
      status: 0,
    });
  } catch (error) {
    console.log(`add hospitalAdmin error:> ${error}`);
    res.json({
      status: 1,
      err: `${error}`,
    });
  }
});

export default router;
