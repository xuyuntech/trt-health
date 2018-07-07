import express from 'express';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bfetch(API.Patient.FindByID(id), { req });
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
    const data = await bfetch(API.Patient.Query(), { req });
    res.json({
      status: 0,
      results: data,
    });
  } catch (err) {
    res.json(err);
  }
});

// router.put('/:name', async (req, res) => {
//   const { name } = req.params;
//   try {
//     const data = await bfetch(API.Patient.Update(name), {
//       method: 'PUT',
//       req,
//       body: {
//         ...req.body,
//         $class: 'org.xuyuntech.health.Patient',
//       },
//     });
//     res.json({
//       status: 0,
//       results: data,
//     });
//   } catch (err) {
//     res.json(err);
//   }
// });

router.post('/', async (req, res) => {
  try {
    const data = await bfetch(API.Patient.Create(), {
      method: 'POST',
      req,
      body: {
        ...req.body,
        $class: 'org.xuyuntech.health.Patient',
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

export default router;
