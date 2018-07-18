import express from 'express';
import Promise from 'promise';
import { bfetch, getFilterParams } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/clear', async (req, res) => {
  try {
    const data = await bfetch(API.Department1.Query(), {
      req,
    });
    await Promise.all(data.map(async (item) => {
      await bfetch(API.Department1.Delete(item.id), { req, method: 'DELETE' });
    }));
    const data1 = await bfetch(API.Department2.Query(), {
      req,
    });
    await Promise.all(data1.map(async (item) => {
      await bfetch(API.Department2.Delete(item.id), { req, method: 'DELETE' });
    }));
    res.json({
      status: 0,
    });
  } catch (err1) {
    res.json(err1);
  }
});

router.get('/', async (req, res) => {
  // const { hospitalID } = req.query;
  const { filter, err } = getFilterParams({
    query: req.query,
    include: false,
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
      results: req.query.full ? data : data.map(item => ({ id: item.id, name: item.name })),
    });
  } catch (err1) {
    res.json(err1);
  }
});

// const hospital = 'hospital-1';

// const ns = 'org.xuyuntech.health';
// const hospital = `resource:${ns}.Hospital#$${hospitalID}`;

// 胡桂荣，张慧月, 宋瑞华,
const depMap = {
  中医: [
    { name: '中医一', doctors: ['songqing.zuo', 'qiuxia.zhang'] }, // doctor 临时添加占位
    { name: '中医二', doctors: ['liangyuan.li'] },
    { name: '中医三', doctors: ['songqing.zuo', 'qiuxia.zhang'] }, // doctor 临时添加占位
    { name: '中医五', doctors: ['zhuhe.liu'] },
    { name: '中医六', doctors: ['ying.liu'] },
    { name: '中医七', doctors: ['songqing.zuo', 'hongge.xing'] }, // doctor 临时添加占位
    { name: '中医八', doctors: ['songqing.zuo', 'qiuxia.zhang', 'hongge.xing', 'zhiguo.wang', 'yun.zhao'] },
    { name: '中医九', doctors: ['hailong.shu'] },
  ],
  针灸理疗科: [{
    name: '针灸理疗科',
    doctors: ['zhuhe.liu'],
  }],
  中医妇科: [{ name: '中医妇科', doctors: ['jianxun.zhou'] }],
  简易门诊: [{ name: '简易门诊', doctors: ['songqing.zuo', 'zhiguo.wang'] }], // doctor 临时添加占位
  慢病门诊: [{ name: '慢病门诊', doctors: ['songqing.zuo', 'yun.zhao'] }], // doctor 临时添加占位
  综合病房: [{ name: '综合病房', doctors: ['hailong.shu'] }],
};

function getDepInitData(hospital) {
  const initData = {
    department1: [],
    department2: [],
  };
  Object.keys(depMap).forEach((name, k) => {
    const dep1id = `${hospital}-dep1-${k + 1}`;
    const dep1 = {
      id: dep1id,
      name,
      hospital,
      $class: 'org.xuyuntech.health.Department1',
    };
    initData.department1.push(dep1);
    const dep2 = depMap[name].map((item, k1) => {
      const id = `${dep1id}-${k1 + 1}`;
      // item.doctors.forEach((doctor) => {
      //   if (!initData.doctors[doctor]) {
      //     initData.doctors[doctor] = [];
      //   }
      //   const doctorDep2s = initData.doctors[doctor];
      //   doctorDep2s.push(id);
      // });
      return {
        id,
        ...item,
        department1: dep1id,
        $class: 'org.xuyuntech.health.Department2',
      };
    });
    initData.department2 = initData.department2.concat(dep2);
  });
  return initData;
}
// const initData = {
//   department1: [],
//   department2: [],
// };
/*
deps.map((name, k) => ({
    id: `${hospital}-department1-${k + 1}`,
    name,
    hospital,
    $class: 'org.xuyuntech.health.Department1',
  })),
*/

// Object.keys(depMap).forEach((name, k) => {
//   const dep2 = depMap[name];
//   const dep1id = `${hospital}-dep1-${k + 1}`;
//   const dep2s = dep2.map((item, k1) => ({
//     id: `${dep1id}-${k1 + 1}`,
//     ...item,
//     $class: 'org.xuyuntech.health.Department2',
//   }));
//   initData.department2 = initData.department2.concat(dep2s);
//   const dep1 = {
//     id: dep1id,
//     name,
//     hospital,
//     department2s: dep2s.map(item => item.id),
//     $class: 'org.xuyuntech.health.Department1',
//   };
//   initData.department1.push(dep1);
// });

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

// router.delete('/del', async (req, res) => {
//   try {
//     // department1
//     const dep1 = initData.department1;
//     if (dep1.length) {
//       await Promise.all(dep1.map(async (item) => {
//         await bfetch(API.Department1.Delete(item.id), { req, method: 'DELETE' });
//         console.log(`Delete ${item.name} successfull.`);
//       }));
//       console.log('Delete department1 ok.');
//     }
//     const dep2 = initData.department2;
//     if (dep2.length) {
//       await Promise.all(dep2.map(async (item) => {
//         await bfetch(API.Department2.Delete(item.id), { req, method: 'DELETE' });
//         console.log(`Delete ${item.name} successfull.`);
//       }));
//       console.log('Delete department2 ok.');
//     }
//     res.json({
//       status: 0,
//     });
//   } catch (err) {
//     console.error(err);
//     res.json(err);
//   }
// });

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
    const hospitals = await bfetch(API.Hospitals.Query(), { req });
    await Promise.all(hospitals.map(async (hospital) => {
      const { id } = hospital;
      const initData = getDepInitData(id);
      // department1
      const dep1 = initData.department1;
      if (dep1.length) {
        await Promise.all(dep1.map(async (item) => {
          await bfetch(API.Department1.Create(), { req, method: 'POST', body: { ...item } });
          console.log(`create ${item.name} successfull.`);
        }));
        console.log('create department1 ok.');
      }
      // department2
      const dep2 = initData.department2;
      if (dep2.length) {
        await Promise.all(dep2.map(async (item) => {
          await bfetch(API.Department2.Create(), { req, method: 'POST', body: { ...item } });
          console.log(`create ${item.name} successfull.`);
        }));
        console.log('create department2 ok.');
      }
      console.log(`${id} init ok.`);
    }));
    res.json({
      status: 0,
    });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});


export default router;
