import express from 'express';
import { Sig } from 'tls-sig-api';

import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

const config = {
  sdk_appid: 1400117160,
  expire_after: 180 * 24 * 3600,
  private_key: '../../keys/private_key',
  public_key: '../../keys/public_key',
};
const usersigmid = new Sig(config).genSig('admin');

router.post('/init', async (req, res) => {
  const body = {
    ...req.body,
    Identifier: req.currentUser.username,
  };
  try {
    console.log(req.currentUser.username);
    const data = await bfetch(API.Imtencent.Import(config.sdk_appid, usersigmid), {
      method: 'POST',
      req,
      body,
    });
    console.log('data', data);
    res.json({
      status: 0,
      result: data,
    });
  } catch (err) {
    console.log('err', err);
    res.json(err);
  }
});
router.post('/', async (req, res) => {
  const body = {
    ...req.body,
    SyncOtherMachine: 1,
    From_Account: req.currentUser.username,
    To_Account: req.body.doctorName,
    MsgRandom: Math.floor(Math.random() * 9999999),
    MsgTimeStamp: Date.now(),
    MsgBody: [
      {
        MsgType: 'TIMTextElem',
        MsgContent: {
          Text: req.body.textMsg,
        },
      },
      {
        MsgType: 'TIMFaceElem',
        MsgContent: {
          Index: req.body.faceIndex,
          Data: req.body.faceData,
        },
      },
    ],
  };
  try {
    console.log(req.currentUser.username);
    const data = await bfetch(API.Imtencent.Send(config.sdk_appid, usersigmid), {
      method: 'POST',
      req,
      body,
    });
    console.log('data', data);
    res.json({
      status: 0,
      result: data,
    });
  } catch (err) {
    console.log('err', err);
    res.json(err);
  }
});

export default router;
