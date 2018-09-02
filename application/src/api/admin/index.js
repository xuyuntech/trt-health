import express from 'express';
import log4js from 'log4js';
import { bfetch } from '../utils';
import { API, getRes } from '../../const';
import data from './data';

const logger = log4js.getLogger('API admin');
logger.level = 'debug';

const router = express.Router();

router.get('/init', async (req, res) => {
  logger.debug('--> /admin/init');
  const user = req.currentUser;
  if (!user.isAdmin()) {
    res.json({
      status: 403,
      err: 'not admin',
    });
    return;
  }
  const ds = data || {};
  let { hospitals = [], doctors = [] } = ds;
  logger.debug(hospitals.length, doctors.length);
  const hLen = hospitals.length;
  hospitals = hospitals.map((hospital, i) => ({
    ...hospital,
    id: `hospital-${i}`,
  }));
  doctors = doctors.map((doctor) => {
    const hospital = hospitals[Math.floor(Math.random() * hLen)];
    const { departments } = hospital;
    return {
      ...doctor,
      hospital: getRes('Hospital', hospital.id),
      departments: [departments[Math.floor(Math.random() * departments.length)]],
    };
  });


  res.json({
    status: 0,
    result: {
      ...req.currentUser,
    },
  });
});

export default router;
