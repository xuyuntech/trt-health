import express from 'express';
// import uuidv1 from 'uuid/v1';
import { bfetch, addParticipantIdentity, ErrNotFound, ErrNoContent } from '../utils';
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

router.get('/:name', async (req, res) => {
  try {
    const data = await bfetch(API.HospitalAdmin.FindByName(req.params.name), {
      req,
      filter: JSON.stringify({
        include: 'resolve',
      }),
    });
    res.json({
      status: 0,
      result: data,
    });
  } catch (err) {
    if (err !== ErrNotFound) {
      console.error(err);
      res.json(err);
      return;
    }
  }
  try {
    const data = await bfetch(API.OrgAdmin.FindByName(req.params.name), {
      req,
      filter: JSON.stringify({
        include: 'resolve',
      }),
    });
    res.json({
      status: 0,
      result: data,
    });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

router.post('/', async (req, res) => {
  const {
    username, password, hospital,
  } = req.body;
  let { email } = req.body;
  let errMsg = '';
  if (!username) {
    errMsg = '用户名不能为空';
  } else
  if (!/^[a-zA-Z]{1}[a-zA-Z0-9_-]{5,15}$/.test(username)) {
    errMsg = '用户名格式不正确';
  } else
  if (!password || password.length < 8) {
    errMsg = '密码格式不正确';
  } else if (!email) {
    email = `${username}@xuyuntech.com`;
    console.warn('HospitalAdmin create warning: use default email');
  } else if (!hospital) {
    errMsg = '需要绑定医院';
  }
  if (errMsg) {
    res.json({
      status: 1,
      err: errMsg,
    });
    return;
  }
  try {
    await bfetch(API.Users.Create(), {
      method: 'POST',
      req,
      body: {
        username, password, email,
      },
    });
  } catch (err) {
    console.error(err);
    if (err.status !== 422) {
      res.json(err);
      return;
    }
  }
  let accessToken = null;
  try {
    const data = await bfetch(API.Users.Login(), {
      method: 'POST',
      body: {
        username, password,
      },
    });
    accessToken = data.id; //eslint-disable-line
  } catch (err) {
    console.error(`login for access token err: ${err}`);
    res.json({
      status: 1,
      err: `login for access token err: ${err}`,
    });
    return;
  }
  // const accessToken = req.header('X-Access-Token');
  await addParticipantIdentity({
    currentCardName: 'admin@trt-health',
    username,
    accessToken,
    resourceType: 'HospitalAdmin',
    participantData: {
      hospital: {
        relation: true,
        type: 'Hospital',
        id: hospital,
      },
      creator: {
        relation: true,
        type: 'OrgAdmin',
        id: req.currentUser.username,
      },
    },
  });
  try {
    await bfetch(API.Users.Logout(), {
      method: 'POST',
      headers: {
        'X-Access-Token': accessToken,
      },
    });
  } catch (err) {
    if (err !== ErrNoContent) {
      console.error(`logout for remove access token err: ${err}`);
      res.json({
        status: 1,
        err: `logout for remove access token err: ${err}`,
      });
      return;
    }
  }
  res.json({
    status: 0,
  });
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

router.post('/backup', async (req, res) => {
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
