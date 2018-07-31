import express from 'express';
import { Sig } from 'tls-sig-api';
import { config } from './config';

import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();


const usersigmid = new Sig(config).genSig('admin');

router.post('/', async (req, res) => {
  const body = {
    ...req.body,
    Identifier: req.currentUser.username,
  };
  try {
    const data = await bfetch(API.RegisterHistory.Create(), {
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
