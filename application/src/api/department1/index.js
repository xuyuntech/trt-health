import express from 'express';
import Promise from 'promise';
import { bfetch, getFilterParams } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/', async (req, res) => {
  // const { hospitalID } = req.query;
  const { filter, err } = getFilterParams({
    query: req.query,
    include: true,
    paramsMapFunc: {
      hospital: { test: 'required', errMsg: '需要指定医院', getValue: v => `resource:org.xuyuntech.health.Hospital#${v}` },
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
    const data = await bfetch(API.Department1.Query(), {
      req,
      params: { filter: JSON.stringify(filter) },
    });
    res.json({
      status: 0,
      results: data,
    });
  } catch (err1) {
    res.json(err1);
  }
});

const hospital = '61cd06e0-7d37-11e8-b8bd-33dbbb63e067';
const doctor = 'songqing.zuo';
// const ns = 'org.xuyuntech.health';
// const hospital = `resource:${ns}.Hospital#$${hospitalID}`;

const depMap = {
  中医: ['中医一', '中医二', '中医三', '中医五', '中医六', '中医七', '中医八', '中医九'],
  针灸理疗科: ['针灸理疗科'],
  中医妇科: ['中医妇科'],
  简易门诊: ['简易门诊'],
  慢病门诊: ['慢病门诊'],
  综合病房: ['综合病房'],
};

const initData = {
  department1: [],
  department2: [],
};
/*
deps.map((name, k) => ({
    id: `${hospital}-department1-${k + 1}`,
    name,
    hospital,
    $class: 'org.xuyuntech.health.Department1',
  })),
*/

Object.keys(depMap).forEach((name, k) => {
  const dep2 = depMap[name];
  const dep1id = `${hospital}-dep1-${k + 1}`;
  const dep2s = dep2.map((name1, k1) => ({
    id: `${dep1id}-${k1 + 1}`,
    name: name1,
    $class: 'org.xuyuntech.health.Department2',
    doctors: [doctor],
  }));
  initData.department2 = initData.department2.concat(dep2s);
  const dep1 = {
    id: dep1id,
    name,
    hospital,
    department2s: dep2s.map(item => item.id),
    $class: 'org.xuyuntech.health.Department1',
  };
  initData.department1.push(dep1);
});

router.post('/', async (req, res) => {
  try {
    // department1
    const result = await bfetch(API.Department1.Create(), { req, method: 'POST', body: { ...req.body } });
    res.json({
      status: 0,
      result,
    });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

router.delete('/del', async (req, res) => {
  try {
    // department1
    const dep1 = initData.department1;
    if (dep1.length) {
      await Promise.all(dep1.map(async (item) => {
        await bfetch(API.Department1.Delete(item.id), { req, method: 'DELETE' });
        console.log(`Delete ${item.name} successfull.`);
      }));
      console.log('Delete department1 ok.');
    }
    const dep2 = initData.department2;
    if (dep2.length) {
      await Promise.all(dep2.map(async (item) => {
        await bfetch(API.Department2.Delete(item.id), { req, method: 'DELETE' });
        console.log(`Delete ${item.name} successfull.`);
      }));
      console.log('Delete department2 ok.');
    }
    res.json({
      status: 0,
    });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

// router.post('/init', async (req, res) => {
//   try {
//     const oData = await bfetch(API.Hospitals.FindByID(hospital), { req });
//     const resData = await bfetch(API.Hospitals.Update(hospital), {
//       req,
//       method: 'PUT',
//       body: {
//         ...oData,
//         department: JSON.stringify(depMap),
//       },
//     });
//     res.json({
//       status: 0,
//       result: resData,
//     });
//   } catch (err) {
//     console.error(err);
//     res.json(err);
//   }
// });

router.post('/init', async (req, res) => {
  try {
    const dep2 = initData.department2;
    console.log('dep2', dep2);
    if (dep2.length) {
      await Promise.all(dep2.map(async (item) => {
        await bfetch(API.Department2.Create(), { req, method: 'POST', body: { ...item } });
        console.log(`create ${item.name} successfull.`);
      }));
      console.log('create department2 ok.');
    }
    // department1
    const dep1 = initData.department1;
    console.log('dep1', dep1);
    if (dep1.length) {
      await Promise.all(dep1.map(async (item) => {
        await bfetch(API.Department1.Create(), { req, method: 'POST', body: { ...item } });
        console.log(`create ${item.name} successfull.`);
      }));
      console.log('create department1 ok.');
    }
    res.json({
      status: 0,
    });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});


export default router;
