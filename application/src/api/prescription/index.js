import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bfetch(API.Prescription.FindByID(id), {
      req,
      params: {
        filter: JSON.stringify({
          include: 'resolve',
        }),
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

router.get('/', async (req, res) => {
  const where = {};
  const filter = {
    include: 'resolve',
  };

  if (Object.keys(where).length > 0) {
    filter.where = where;
  }

  try {
    const data = await bfetch(API.Prescription.Query(), {
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
    created: new Date().toISOString(),
    registerHistory: `resource:org.xuyuntech.health.Visitor#${req.body.registerHistory}`,
    caseItem: `resource:org.xuyuntech.health.Patient#${req.body.caseItem}`,
    patient: `resource:org.xuyuntech.health.ArrangementHistory#${req.body.patient}`,
    id: uuidv1(),
    $class: 'org.xuyuntech.health.Prescription',
  };
  try {
    const data = await bfetch(API.Prescription.Create(), {
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
