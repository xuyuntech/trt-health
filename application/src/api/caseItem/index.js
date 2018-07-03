import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bfetch(API.CaseItem.FindByID(id), { req });
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
    const data = await bfetch(API.CaseItem.Query(), { req });
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
    const data = await bfetch(API.CaseItem.Create(), {
      method: 'POST',
      req,
      body: {
        ...req.body,
        created: new Date().toISOString(),
        $class: 'org.xuyuntech.health.CaseItem',
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
