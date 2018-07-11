import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

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
