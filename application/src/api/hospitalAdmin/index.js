import express from 'express';
// import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/', (req, res) => {
  console.log('req.currentUser', req.currentUser);
  res.end('123');
});

router.post('/', async (req, res) => {
  console.log('req.currentUser', req.currentUser);
  console.log(`resource:org.xuyuntech.health.OrgAdmin#${req.currentUser.username}`);
  try {
    const body = {
      ...req.body,
      name: req.body.name,
      creator: `resource:org.xuyuntech.health.OrgAdmin#${req.currentUser.username}`,
      $class: 'org.xuyuntech.health.HospitalAdmin',
    };
    const data = await bfetch(API.HospitalAdmin.Create(), {
      method: 'POST',
      req,
      body,
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
