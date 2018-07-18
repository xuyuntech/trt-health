import express from 'express';
import uuidv1 from 'uuid/v1';
import { bfetch } from '../utils';
import { API } from '../../const';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await bfetch(API.RegisterHistory.FindByID(id), {
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
  const filter = { include: 'resolve' };
  if (req.query.type === 'own') {
    filter.where = { patient: `resource:org.xuyuntech.health.Patient#${req.currentUser.username}` };
  }
  try {
    const data = await bfetch(API.RegisterHistory.Query(), {
      req,
      params: { filter: JSON.stringify(filter) },
    });
    res.json({
      status: 0,
      results: data.map((item) => {
        const {
          id, number, state, type, arrangementHistory, visitor,
        } = item;
        const {
          visitDate, visitTime, doctor, hospital,
        } = arrangementHistory;
        return {
          id,
          number,
          state,
          type,
          visitDate,
          visitTime,
          visitor: {
            realName: visitor.realName,
            sid: visitor.sid,
            phone: visitor.phone,
            gender: visitor.gender,
            age: visitor.age,
          },
          doctorName: doctor.realName,
          hospitalName: hospital.name,
        };
      }),
    });
  } catch (err1) {
    res.json(err1);
  }
});

router.put('/verify/:id', async (req, res) => {
  try {
    const body = {
      registerHistory: req.params.id,
    };
    const result = await bfetch(API.VerifyRegisterAction.Create(), {
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
 * @api {put} /paid/:id paid
 * @apiName put registerHistory/paid/:id'
 * @apiGroup registerHistory
 * @apiParam {Number} id registerHistory unique ID.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
        {
            "status": 0,
            "result": {
                "$class": "org.xuyuntech.health.PayRegisterAction",
                "registerHistory": "7df02540-88d2-11e8-a32d-b7f577b21831",
                "transactionId": "05529497180864005a452c0c2d1bc6822503938177db38e54758b7545af47a8a"
            }
        }
 *  @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Found
 *       {
            "status": 401,
            "err": "Unauthorized"
 *       }
 */
router.put('/paid/:id', async (req, res) => {
  try {
    const body = {
      registerHistory: req.params.id,
    };
    const result = await bfetch(API.PayRegisterAction.Create(), {
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
 * @api {put} /finish/:id finish
 * @apiName put registerHistory/finish/:id
 * @apiGroup registerHistory
 * @apiParam {Number} id registerHistory unique ID.
 * @apiParam {double} points points of patient
 * @apiParam {string} complained complained of patient for caseItem
 * @apiParam {string} diagnose diagnose of patient for caseItem
 * @apiParam {string} history history of patient for caseItem
 * @apiParam {string} familyHistory familyHistory of patient for caseItem
 * @apiParam {medicallistform} medicallistform medicallistform
 * @apiParam {list} form  {"medicalItem":"resource:org.xuyuntech.health.MedicalItem#1","count":10}
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
      {
          "status": 0,
          "result": {
              "$class": "org.xuyuntech.health.FinishRegisterAction",
              "registerHistory":
              "resource:org.xuyuntech.health.RegisterHistory#7df02540-88d2-11e8-a32d-b7f577b21831",
              "id": "3c7c3f20-88d4-11e8-a32d-b7f577b21831",
              "points": 25,
              "complained": "病例描述病例描述病例描述病例描述",
              "diagnose": "病例描述病例描述病例描述病例描述病例描述",
              "history": "病例描述病例描述病例描述病例描述病例描述",
              "familyHistory": "病例描述病例描述病例描述病例描述病例描述",
              "created": "2018-07-16T08:42:56.402Z",
              "medicallistform": [
                  {
                      "$class": "org.xuyuntech.health.MedicalListForm",
                      "medicalItem": "resource:org.xuyuntech.health.MedicalItem#1",
                      "count": 10
                  },
                  {
                      "$class": "org.xuyuntech.health.MedicalListForm",
                      "medicalItem": "resource:org.xuyuntech.health.MedicalItem#2",
                      "count": 5
                  }
              ],
              "transactionId": "7124c5d67c015bd79813481345292256a9db82c2908b7acaf0de7c0fca206958"
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
      registerHistory: `resource:org.xuyuntech.health.RegisterHistory#${req.params.id}`,
      id: uuidv1(),
      complained: req.body.complained,
      diagnose: req.body.diagnose,
      history: req.body.history,
      familyHistory: req.body.familyHistory,
      created: new Date().toISOString(),
      medicallistform: req.body.medicallistform,
      points: req.body.points,
    };
    const result = await bfetch(API.FinishRegisterAction.Create(), {
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

router.post('/', async (req, res) => {
  const body = {
    ...req.body,
    created: new Date().toISOString(),
    state: 'Init',
    type: req.body.type,
    visitor: `resource:org.xuyuntech.health.Visitor#${req.body.visitor}`,
    patient: `resource:org.xuyuntech.health.Patient#${req.currentUser.username}`,
    arrangementHistory: `resource:org.xuyuntech.health.ArrangementHistory#${req.body.arrangementHistory}`,
    id: uuidv1(),
    $class: 'org.xuyuntech.health.RegisterHistory',
  };
  try {
    const data = await bfetch(API.RegisterHistory.Create(), {
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
