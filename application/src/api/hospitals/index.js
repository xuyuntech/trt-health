import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bfetch(API.Hospitals.FindByID(id), { req });
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
    const data = await bfetch(API.Hospitals.Query(), { req });
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
