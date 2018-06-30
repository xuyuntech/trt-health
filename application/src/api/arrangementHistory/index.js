import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/', async (req, res) => {
  const { visitDate, f } = req.query;
  const where = {};
  const filter = {
    include: 'resolve',
  };
  if (f === 'true') {
    if (visitDate && !/^\d{4}-\d{2}-\d{2}$/.test(visitDate)) {
      res.json({
        status: 1,
        err: '日期格式错误',
      });
      return;
    }
    where.visitDate = new Date(visitDate).toISOString();
  }

  if (Object.keys(where).length > 0) {
    filter.where = where;
  }

  try {
    const data = await bfetch(API.ArrangementHistory.Query(), {
      req,
      params: { filter: JSON.stringify(filter) },
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
  const body = {
    ...req.body,
    id: uuidv1(),
    $class: 'org.xuyuntech.health.ArrangementHistory',
  };
  try {
    const data = await bfetch(API.ArrangementHistory.Create(), {
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
