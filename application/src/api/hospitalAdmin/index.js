import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/', (req, res) => {
  console.log('req.currentUser', req.currentUser);
  res.end('123');
});

router.delete('/:name', async (req, res) => {
  const { name } = req.params;
  try {
    if (name) {
      await bfetch(API.HospitalAdmin.Delete(name), {
        method: 'DELETE',
        req,
      });
      console.log('Delete hospitalAdmin ok.');
    }
    res.json({
      status: 0,
    });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

router.post('/', async (req, res) => {
  console.log('req.currentUser', req.currentUser);
  try {
    const data = await bfetch(API.HospitalAdmin.Create(), {
      method: 'POST',
      req,
      body: {
        ...req.body,
        $class: 'org.xuyuntech.health.HospitalAdmin',
        id: uuidv1(),
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
