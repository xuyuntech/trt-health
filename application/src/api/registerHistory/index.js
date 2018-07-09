import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bfetch(API.RegisterHistory.FindByID(id), {
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
  const {
    f, username,
  } = req.query;
  console.log('username', username);
  const where = {};
  const filter = {
    include: 'resolve',
  };
  if (f === 'true') {
    if (username) {
      where.patient = `resource:org.xuyuntech.health.Patient#${username}`;
    }
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

router.put('/verify/:id', async (req, res) => {
  try {
    const body = {
      registerHistory: req.params.id,
    };
    const result = await bfetch(API.VerifyRegisterAction.Create(), {
      method: 'POST',
      req,
      body,
    });
    res.json({
      status: 0,
      result,
    });
  } catch (err) { res.json(err); }
});
router.put('/finish/:id', async (req, res) => {
  try {
    const body = {
      registerHistory: `resource:org.xuyuntech.health.RegisterHistory#${req.params.id}`,
      id: uuidv1(),
      complained: req.body.complained,
      diagnose: req.body.diagnose,
      history: req.body.history,
      familyHistory: req.body.familyHistory,
      created: new Date().toISOString(),
      medicallistform: req.body.medicallistform,
      points: req.body.points,
    };
    const result = await bfetch(API.FinishRegisterAction.Create(), {
      method: 'POST',
      req,
      body,
    });
    res.json({
      status: 0,
      result,
    });
  } catch (err) { res.json(err); }
});

router.post('/', async (req, res) => {
  const body = {
    ...req.body,
    created: new Date().toISOString(),
    visitor: `resource:org.xuyuntech.health.Visitor#${req.body.visitor}`,
    patient: `resource:org.xuyuntech.health.Patient#${req.body.patient}`,
    arrangementHistory: `resource:org.xuyuntech.health.ArrangementHistory#${req.body.arrangementHistory}`,
    id: uuidv1(),
    $class: 'org.xuyuntech.health.RegisterHistory',
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


export default router;
