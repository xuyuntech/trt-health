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
 *                "$class": "org.xuyuntech.health.HospitalAdmin",
 *                "creator": "resource:org.xuyuntech.health.OrgAdmin#2705",
 *                "name": "1457"
 *              }
 *                   ]
 *     }
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Found
 *       {
            "status": 401,
            "err": "Unauthorized"
 *       }
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

/**
 * @api {post} / post HospitalAdmin information
 * @apiName postHospitalAdmin
 * @apiGroup HospitalAdmin
 *
 * @apiParam {string} name name of HospitalAdmin
 * @apiParam {string} realName realName of HospitalAdmin
 * @apiParam {string} phtone phone of HospitalAdmin
 * @apiParam {string} sid sid of HospitalAdmin
 * @apiParam {string} email email of HospitalAdmin
 * @apiParam {string} address address of HospitalAdmin
 * @apiParam {string} birthday birthday of HospitalAdmin
 * @apiParam {string} avatar avatar of HospitalAdmin
 * @apiParam {enum} gender gender of HospitalAdmin   UNKNOW MALE FEMALE
 * @apiParam {double} age age of HospitalAdmin
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
      {
          "status": 0,
          "result": {
              "$class": "org.xuyuntech.health.HospitalAdmin",
              "creator": "resource:org.xuyuntech.health.OrgAdmin#trt-admin",
              "name": "zhangsan",
              "realName": "string",
              "phone": "string",
              "sid": "string",
              "email": "string",
              "address": "string",
              "birthday": "string",
              "avatar": "string",
              "gender": "UNKNOW",
              "age": 0
          }
      }
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Found
 *       {
            "status": 401,
            "err": "Unauthorized"
 *       }
 */

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
