import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bfetch(API.MedicalItems.FindByID(id), { req });
    res.json({
      status: 0,
      result: data,
    });
  } catch (err) {
    res.json(err);
  }
});

router.get('/', async (req, res) => {
  const { productionDate, expiredDate, f } = req.query;
  const where = {};
  const filter = {
    include: 'resolve',
  };
  if (f === 'true') {
    if (productionDate && !/^\d{4}-\d{2}-\d{2}$/.test(productionDate)) {
      res.json({
        status: 1,
        err: '日期格式错误',
      });
      return;
    }
    where.productionDate = new Date(productionDate).toISOString();

    if (expiredDate && !/^\d{4}-\d{2}-\d{2}$/.test(expiredDate)) {
      res.json({
        status: 1,
        err: '日期格式错误',
      });
      return;
    }
    where.expiredDate = new Date(expiredDate).toISOString();
  }

  if (Object.keys(where).length > 0) {
    filter.where = where;
  }

  try {
    const data = await bfetch(API.MedicalItems.Query(), {
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

router.put('/', async (req, res) => {
  const {
    id, title, quantity, price, barcode, batchNumber, productionDate, expireDate,
  } = req.body;
  try {
    const data = await bfetch(API.MedicalItems.Update(id), {
      method: 'PUT',
      req,
      body: {
        title,
        quantity,
        price,
        barcode,
        batchNumber,
        productionDate,
        expireDate,
        $class: 'org.xuyuntech.health.MedicalItem',
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

router.post('/', async (req, res) => {
  try {
    const data = await bfetch(API.MedicalItems.Create(), {
      method: 'POST',
      req,
      body: {
        ...req.body,
        $class: 'org.xuyuntech.health.MedicalItem',
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

export default router;
