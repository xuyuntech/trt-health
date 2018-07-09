import express from 'express';
import fetch from 'isomorphic-fetch';
import crypto from 'crypto';
import { API } from '../../const';
import { bfetch } from '../utils';


// userID = bjtrt-ts01
// userSecret = kZYafhQWZnMw

const router = express.Router();

router.get('/userinfo', async (req, res) => {
  try {
    const { username } = req.currentUser;
    const patientRes = await bfetch(API.Patient.FindByName(username), {
      req,
    });
    const shasum = crypto.createHash('sha1');
    const secret = shasum.update([username].sort().join('')).digest('hex');
    res.json({
      status: 0,
      result: {
        ...patientRes,
        walletAddress: secret,
      },
    });
  } catch (err) {
    res.json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const res1 = await fetch(API.Users.FindByID(req.params.id), {
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': req.cookies['X-Access-Token'],
      },
    });
    if (res1.status === 401) {
      res.json({
        status: 401,
      });
      return;
    }
    const data = await res1.json();
    res.json({
      status: 0,
      result: data,
    });
  } catch (err) {
    res.json({
      status: 1,
      err: `${err}`,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const res1 = await fetch(API.Users.Login(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    if (res1.status === 401) {
      res.json({
        status: 1,
        err: '用户名或密码不正确',
      });
      return;
    }
    const data = await res1.json();
    res.json({
      status: 0,
      result: data,
    });
  } catch (err) {
    res.json({
      status: 1,
      err: `${err}`,
    });
  }
});

export default router;
