import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bfetch(API.RegisterHistory.FindByID(id), { req });
    res.json({
      status: 0,
      result: data,
    });
  } catch (err) {
    res.json(err);
  }
});

router.get('/', async (req, res) => {
  const { created, f } = req.query;
  const where = {};
  const filter = {
    include: 'resolve',
  };
  if (f === 'true') {
    if (created && !/^\d{4}-\d{2}-\d{2}$/.test(created)) {
      res.json({
        status: 1,
        err: '日期格式错误',
      });
      return;
    }
    where.created = new Date(created).toISOString();
  }

  if (Object.keys(where).length > 0) {
    filter.where = where;
  }

  try {
    const data = await bfetch(API.RegisterHistory.Query(), {
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

router.put('/', async (req, res) => {
  const {
    id, state, created,
  } = req.body;
  try {
    const data = await bfetch(API.RegisterHistory.Update(id), {
      method: 'PUT',
      req,
      body: {
        state,
        created,
        $class: 'org.xuyuntech.health.RegisterHistory',
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
    const data = await bfetch(API.RegisterHistory.Create(), {
      method: 'POST',
      req,
      body: {
        ...req.body,
        $class: 'org.xuyuntech.health.RegisterHistory',
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
