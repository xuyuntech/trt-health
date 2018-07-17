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
    creator, f,
  } = req.query;
  console.log('creator', creator);
  const where = {};
  const filter = {
    include: 'resolve',
  };
  if (f === 'true') {
    if (creator) {
      where.creator = `resource:org.xuyuntech.health.Patient#${creator}`;
    }
  }

  if (Object.keys(where).length > 0) {
    filter.where = where;
  }

  try {
    const data = await bfetch(API.Visitor.Query(), {
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

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      await bfetch(API.Visitor.Delete(id), {
        method: 'DELETE',
        req,
      });
      console.log('Delete visitor ok.');
    }
    res.json({
      status: 0,
    });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

router.post('/', async (req, res) => {
  const body = {
    ...req.body,
    id: uuidv1(),
    $class: 'org.xuyuntech.health.Visitor',
  };
  try {
    const data = await bfetch(API.Visitor.Create(), {
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
