import express from 'express';
import uuidv1 from 'uuid/v1';
import Promise from 'promise';
import { bfetch, getFilterParams } from '../utils';
import { API } from '../../const';
// import { API, HospitalGrade } from '../../const';
// import initData from './data';

const router = express.Router();

function filterResult(item) {
  return item;
}

router.get('/clear', async (req, res) => {
  try {
    const data = await bfetch(API.Hospitals.Query());
    await Promise.all(data.map(async (item) => {
      await bfetch(API.Hospitals.Delete(item.id), { req, method: 'DELETE' });
    }));
    res.json({ status: 0 });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bfetch(API.Hospitals.FindByID(id), { req });
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
  });
  if (err) {
    res.json(err);
    return;
  }
  try {
    const data = await bfetch(API.Hospitals.Query(), {
      req,
      params: { filter: JSON.stringify(filter) },
    });
    res.json({
      status: 0,
      results: req.query.full ? data : data.map(item => filterResult(item)),
    });
  } catch (err1) {
    console.error(err1);
    res.json(err1);
  }
});

router.put('/', async (req, res) => {
  const {
    id, address, name, phone1, phone2,
  } = req.body;
  try {
    const data = await bfetch(API.Hospitals.Update(id), {
      method: 'PUT',
      req,
      body: {
        address,
        name,
        phone1,
        phone2,
        $class: 'org.xuyuntech.health.Hospital',
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

router.post('/init', async (req, res) => {
  const ds = [
    {
      name: '北京同仁堂唐山中医医院',
      address: '唐山市路北区河东路三益楼5-12号',
      province: '河北省',
      city: '唐山市',
      area: '路北区',
      grade: 'FirstA',
      phone1: '0575',
      phone2: '5918781',
      location: {
        lng: '118.200640',
        lat: '39.660550',
      },
    },
  ];
  // const grades = Object.keys(HospitalGrade).slice(1);
  // Object.keys(initData.data).forEach((key) => {
  //   const {
  //     name, address, phone1, phone2,
  //   } = initData.data[key];
  //   ds.push({
  //     name,
  //     address,
  //     phone1,
  //     phone2,
  //     grade: grades[Math.floor(Math.random() * grades.length)],
  //     reservationQuantity: 0,
  //   });
  // });
  try {
    const results = await Promise.all(ds.map(async (item, k) => {
      const res1 = await bfetch(API.Hospitals.Create(), {
        req,
        method: 'POST',
        body: {
          ...item,
          id: `hospital-${k + 1}`,
        },
      });
      return res1;
    }));
    res.json({
      status: 0,
      results,
    });
  } catch (err) {
    res.json(err);
  }
});
router.post('/', async (req, res) => {
  try {
    const data = await bfetch(API.Hospitals.Create(), {
      method: 'POST',
      req,
      body: {
        ...req.body,
        $class: 'org.xuyuntech.health.Hospital',
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
// router.get('/a', async (req, res) => {
//   try {
//     const res1 = await fetch('http://localhost:3000/api/Hospital', {
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Access-Token': req.header('X-Access-Token'),
//       },
//     });
//     if (res1.status !== 200) {
//       res.json({
//         status: 1,
//         err: `Error: ${res1.status}, ${res1.statusText}`,
//       });
//       return;
//     }
//     const data = await res1.json();
//     res.json({
//       status: 0,
//       results: data,
//     });
//   } catch (err) {
//     res.json({
//       status: 1,
//       err: `${err}`,
//     });
//   }
// });


export default router;
