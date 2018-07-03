import express from 'express';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await bfetch(API.Department2.FindByID(id), {
      req,
      params: {
        filter: JSON.stringify({ include: 'resolve' }),
      },
    });
    res.json({
      status: 0,
      result,
    });
  } catch (err) {
    res.json(err);
  }
});

export default router;
