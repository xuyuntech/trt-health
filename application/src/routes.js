import initRoute from './api/init';
import wechatRoute from './api/wechat';
import usersRoute from './api/users';
import hospitalsRoute from './api/hospitals';
import doctorRoute from './api/doctor';
import patientRoute from './api/patient';
import arrangementHistoryRoute from './api/arrangementHistory';
import supplierRoute from './api/supplier';
import medicalItemsRoute from './api/medicalItems';
import registerHistoryRoute from './api/registerHistory';
import visitorRoute from './api/visitor';
import caseItemRoute from './api/caseItem';

export default function (app) {
  app.use('/init', initRoute);
  app.use('/auth/wechat', wechatRoute);
  app.use('/auth/users', usersRoute);
  app.use('/hospitals', hospitalsRoute);
  app.use('/doctor', doctorRoute);
  app.use('/patient', patientRoute);
  app.use('/arrangement_history', arrangementHistoryRoute);
  app.use('/supplier', supplierRoute);
  app.use('/medicalItems', medicalItemsRoute);
  app.use('/register_History', registerHistoryRoute);
  app.use('/visitor', visitorRoute);
  app.use('/caseItem', caseItemRoute);
}
