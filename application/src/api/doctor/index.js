import express from 'express';
import Promise from 'promise';
import { bfetch } from '../utils';
import { API } from '../../const';
import initData from './data';

const router = express.Router();

router.post('/init', async (req, res) => {
  const { data } = initData;
  try {
    const results = await Promise.all(data.map(async (item) => {
      const {
        name, realname, phone, title, skilledln, description,
      } = item;
      const res1 = await bfetch(API.Doctor.Create(), {
        req,
        method: 'POST',
        body: {
          name,
          realName: realname,
          phone,
          title,
          skilledIn: skilledln,
          description,
          gender: 'UNKNOW',
        },
      });
      return res1;
    }));
    res.json({
      status: 0,
      results,
    });
  } catch (err) {
    res.json(err);
  }
  res.end(data);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bfetch(API.Doctor.FindByID(id), { req });
    res.json({
      status: 0,
      result: data,
    });
  } catch (err) {
    res.json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await bfetch(API.Doctor.Query(), { req });
    res.json({
      status: 0,
      results: data,
    });
  } catch (err) {
    res.json(err);
  }
});

router.put('/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const data = await bfetch(API.Doctor.Update(name), {
      method: 'PUT',
      req,
      body: {
        ...req.body,
        $class: 'org.xuyuntech.health.Doctor',
      },
    });
    res.json({
      status: 0,
      results: data,
    });
  } catch (err) {
    res.json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await bfetch(API.Doctor.Create(), {
      method: 'POST',
      req,
      body: {
        ...req.body,
        $class: 'org.xuyuntech.health.Doctor',
      },
    });
    res.json({
      status: 0,
      result: data,
    });
  } catch (err) {
    res.json(err);
  }
});


export default router;
