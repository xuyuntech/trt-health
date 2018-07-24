import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch, getFilterParams } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/all', async (req, res) => {
  const { visitDate } = req.query;
  try {
    const data = await bfetch(API.ArrangementHistory.Query(), {
      req,
      params: { filter: JSON.stringify({ include: 'resolve', where: { visitDate: new Date(visitDate).toISOString() } }) },
    });
    res.json({
      status: 0,
      results: data,
    });
  } catch (err1) {
    res.json(err1);
  }
});


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
  const { filter, err } = getFilterParams({
    query: req.query,
    include: true,
    paramsMapFunc: {
      visitDate: { getValue: v => new Date(v).toISOString(), type: 'date' },
      hospital: { getValue: v => `resource:org.xuyuntech.health.Hospital#${v}` },
      doctor: { getValue: v => `resource:org.xuyuntech.health.Doctor#${v}` },
      department1: { getValue: v => `resource:org.xuyuntech.health.Department1#${v}` },
      department2: { getValue: v => `resource:org.xuyuntech.health.Department2#${v}` },
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
    let arrangements = [];
    if (req.currentUser) {
      arrangements = await bfetch(API.RegisterHistory.Query(), {
        req,
        params: {
          filter: JSON.stringify({
            where: {
              patient: `resource:org.xuyuntech.health.Patient#${req.currentUser.username}`,
            },
          }),
        },
      });
      console.log('arrangements>>>', arrangements);
    }
    // 获取用户已预约的挂号单
    const data = await bfetch(API.ArrangementHistory.Query(), {
      req,
      params: { filter: JSON.stringify(filter) },
    });
    res.json({
      status: 0,
      results: data.map((item) => {
        const { department1, department2 } = item;
        const registerHistory = arrangements.find(a => a.arrangementHistory === `resource:org.xuyuntech.health.ArrangementHistory#${item.id}`);
        return {
          ...item,
          department1: {
            id: department1.id,
            name: department1.name,
          },
          department2: {
            id: department2.id,
            name: department2.name,
          },
          registerHistoryID: registerHistory && registerHistory.id,
        };
      }),
    });
  } catch (err1) {
    console.error(err1);
    res.json(err1);
  }
});

router.get('/aaa', async (req, res) => {
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
