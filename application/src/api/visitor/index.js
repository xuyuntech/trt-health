import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await bfetch(API.Visitor.DeleteByID(id), {
      req,
      method: 'DELETE',
    });
    res.json({
      status: 0,
    });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await bfetch(API.Visitor.FindByID(id), {
      req,
    });
    res.json({
      status: 0,
      result: data,
    });
  } catch (err1) {
    console.error(err1);
    res.json(err1);
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await bfetch(API.Visitor.Query(), {
      req,
      params: { filter: JSON.stringify({ where: { creator: `resource:org.xuyuntech.health.Patient#${req.currentUser.username}` } }) },
    });
    res.json({
      status: 0,
      results: data,
    });
  } catch (err1) {
    res.json(err1);
  }
});

router.post('/', async (req, res) => {
  const body = {
    ...req.body,
    id: uuidv1(),
    creator: req.currentUser.username,
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
router.put('/:id', async (req, res) => {
  const body = {
    ...req.body,
    creator: req.currentUser.username,
    $class: 'org.xuyuntech.health.Visitor',
  };
  try {
    const data = await bfetch(API.Visitor.Update(req.params.id), {
      method: 'PUT',
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
