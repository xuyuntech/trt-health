import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch, getFilterParams } from '../utils';
import { API } from '../../const';

const router = express.Router();

function filterResult(item) {
  const {
    department1, department2, hospital, doctor,
  } = item;
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
    hospital: {
      id: hospital.id,
      name: hospital.name,
    },
    doctor: {
      realName: doctor.realName,
      name: doctor.name,
    },
  };
}

router.get('/all', async (req, res) => {
  const { visitDate } = req.query;
  try {
    const where = {
      visitDate: new Date(visitDate).toISOString(),
    };
    if (req.hospitalID) {
      where.hospital = `resource:org.xuyuntech.health.Hospital#${req.hospitalID}`;
    }
    const data = await bfetch(API.ArrangementHistory.Query(), {
      req,
      params: {
        filter: JSON.stringify({
          include: 'resolve',
          where,
        }),
      },
    });
    res.json({
      status: 0,
      results: req.query.full ? data : data.map(item => filterResult(item)),
    });
  } catch (err1) {
    res.json(err1);
  }
});

router.put('/:id/cancel', async (req, res) => {
  try {
    await bfetch(API.ArrangementHistory.Cancel(), {
      req,
      method: 'POST',
      body: {
        arrangementHistory: req.params.id,
        operate: 'cancel',
      },
    });
    res.json({
      status: 0,
    });
  } catch (err1) {
    console.error(err1);
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
      result: req.query.full ? data : filterResult(data),
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
    const { fromVisitDate } = req.query;
    if (fromVisitDate) {
      filter.where.visitDate = { gte: new Date(fromVisitDate).toISOString() };
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
