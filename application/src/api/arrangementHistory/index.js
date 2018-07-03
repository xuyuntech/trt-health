import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bfetch(API.ArrangementHistory.FindByID(id), {
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
    visitDate, f, doctorName, hospitalID,
  } = req.query;
  console.log('doctorName', doctorName);
  const where = {};
  const filter = {
    include: 'resolve',
  };
  if (f === 'true') {
    if (visitDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(visitDate)) {
        res.json({
          status: 1,
          err: '日期格式错误',
        });
        return;
      }
      where.visitDate = new Date(visitDate).toISOString();
    }

    if (doctorName) {
      if (!/^[0-9a-zA-Z._]+$/.test(doctorName)) {
        res.json({
          status: 1,
          err: '医师名称格式不正确',
        });
        return;
      }
      where.doctor = `resource:org.xuyuntech.health.Doctor#${doctorName}`;
    }

    if (hospitalID) {
      where.hospital = `resource:org.xuyuntech.health.Hospital#${hospitalID}`;
    }
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
