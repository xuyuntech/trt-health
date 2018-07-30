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
      result: {
        ...result,
        registerHistory: `${req.currentUser.username}-${arrangementHistory}`,
      },
    });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});
/**
 * @api {put} /paid/:id Order/paid/:id
 * @apiName put Order/paid/:id'
 * @apiGroup Order
 * @apiParam {Number} id Order unique ID.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
        {
            "status": 0,
            "result": {
                "$class": "org.xuyuntech.health.PayAction",
                "id": "d1c20620-88d7-11e8-a8df-574842ac90c5",
                "created": "2018-07-16T09:08:35.330Z",
                "order": "resource:org.xuyuntech.health.Order#3c7c3f20-88d4-11e8-a32d-b7f577b21831",
                "transactionId": "ada299db17eeb01e3edb01b2980e776cdf68c4d1ff888e6badf539f52f1999d8"
            }
        }
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Found
 *       {
            "status": 401,
            "err": "Unauthorized"
 *       }
 */
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

/**
 * @api {put} /finish/:id put Order/finish/:id
 * @apiName put Order/finish/:id'
 * @apiGroup Order
 * @apiParam {Number} id Order unique ID.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
        {
            "status": 0,
            "result": {
                "$class": "org.xuyuntech.health.FinishAction",
                "id": "2d033ae0-88d8-11e8-a8df-574842ac90c5",
                "created": "2018-07-16T09:11:08.430Z",
                "order": "resource:org.xuyuntech.health.Order#3c7c3f20-88d4-11e8-a32d-b7f577b21831",
                "storekeeper": "resource:org.xuyuntech.health.StoreKeeper#trt-admin",
                "transactionId": "d018700895a1e5e99cf3360e35c9119e1faeabfa657cf80d40129cce4842b372"
            }
        }
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Found
 *       {
            "status": 401,
            "err": "Unauthorized"
 *       }
 */
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
