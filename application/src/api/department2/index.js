import express from 'express';
import { bfetch, getFilterParams } from '../utils';
import { API } from '../../const';

const router = express.Router();


router.get('/', async (req, res) => {
  // const { hospitalID } = req.query;
  const { filter, err } = getFilterParams({
    query: req.query,
    include: false,
    paramsMapFunc: {
      department1: { test: 'required', errMsg: '需要指定一级部门', getValue: v => `resource:org.xuyuntech.health.Department1#${v}` },
    },
  });
  if (err) {
    res.json({
      status: 0,
      err,
    });
    return;
  }
  try {
    const data = await bfetch(API.Department2.Query(), {
      req,
      params: { filter: JSON.stringify(filter) },
    });
    res.json({
      status: 0,
      results: req.query.full ? data : data.map(item => ({ id: item.id, name: item.name })),
    });
  } catch (err1) {
    res.json(err1);
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await bfetch(API.Department2.FindByID(id), {
      req,
      params: {
        filter: JSON.stringify({ include: 'resolve' }),
      },
    });
    res.json({
      status: 0,
      result,
    });
  } catch (err) {
    res.json(err);
  }
});
router.get('/:id/doctors', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await bfetch(API.Department2.FindByID(id), {
      req,
      params: {
        filter: JSON.stringify({ include: 'resolve' }),
      },
    });
    res.json({
      status: 0,
      results: result.doctors || [],
    });
  } catch (err) {
    res.json(err);
  }
});

export default router;
