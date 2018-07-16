import express from 'express';
// import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

/**
 * @api {get} / Request HospitalAdmin information
 * @apiName GetHospitalAdmin
 * @apiGroup HospitalAdmin
 *
 * @apisuccess {int} status status of res.
 * @apisuccess {list} results results of res.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "status": 0,
 *        "results": [
 *              {
 *                    "$class": "org.xuyuntech.health.HospitalAdmin",
 *                    "creator": "resource:org.xuyuntech.health.OrgAdmin#2705",
 *                   "name": "1457"
 *             }
 *                   ]
 *     }
 *
 */

router.get('/', async (req, res) => {
  try {
    const data = await bfetch(API.HospitalAdmin.Query(), { req });
    res.json({
      status: 0,
      results: data,
    });
  } catch (err) {
    res.json(err);
  }
});

router.post('/', async (req, res) => {
  console.log('req.currentUser', req.currentUser);
  console.log(`resource:org.xuyuntech.health.OrgAdmin#${req.currentUser.username}`);
  try {
    const body = {
      ...req.body,
      name: req.body.name,
      creator: `resource:org.xuyuntech.health.OrgAdmin#${req.currentUser.username}`,
      $class: 'org.xuyuntech.health.HospitalAdmin',
    };
    const data = await bfetch(API.HospitalAdmin.Create(), {
      method: 'POST',
      req,
      body,
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
