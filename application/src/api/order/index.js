import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch, ErrNotFound, getNumber } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    diseaseInfo, type, visitor, arrangementHistory,
  } = req.body;
  try {
    await bfetch(API.RegisterHistory.FindByID(`${req.currentUser.username}-${arrangementHistory}`), { req });
    res.json({
      status: 1,
      err: '重复预约',
    });
    return;
  } catch (err) {
    if (err !== ErrNotFound) {
      console.error(err);
      res.json(err);
      return;
    }
  }
  try {
    const result = await bfetch(API.Order.Register(), {
      method: 'POST',
      req,
      body: {
        diseaseInfo,
        type,
        visitor,
        arrangementHistory,
        number: getNumber('RegisterHistory'),
        $class: 'org.xuyuntech.health.InitRegisterAction',
      },
    });
    res.json({
      status: 0,
      result,
    });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});
router.put('/pay/:id', async (req, res) => {
  try {
    const body = {
      order: `resource:org.xuyuntech.health.Order#${req.params.id}`,
      id: uuidv1(),
      created: new Date().toISOString(),
    };
    const result = await bfetch(API.PayAction.Create(), {
      method: 'POST',
      req,
      body,
    });
    res.json({
      status: 0,
      result,
    });
  } catch (err) { res.json(err); }
});
router.put('/finish/:id', async (req, res) => {
  try {
    const body = {
      order: `resource:org.xuyuntech.health.Order#${req.params.id}`,
      id: uuidv1(),
      created: new Date().toISOString(),
      storekeeper: `resource:org.xuyuntech.health.StoreKeeper#${req.currentUser.username}`,
    };
    const result = await bfetch(API.FinishAction.Create(), {
      method: 'POST',
      req,
      body,
    });
    res.json({
      status: 0,
      result,
    });
  } catch (err) { res.json(err); }
});
export default router;
