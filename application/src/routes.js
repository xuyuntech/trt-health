import initRoute from './api/init';
import wechatRoute from './api/wechat';
import usersRoute from './api/users';
import hospitalsRoute from './api/hospitals';
import doctorRoute from './api/doctor';
import arrangementHistoryRoute from './api/arrangementHistory';
import registerHistoryRoute from './api/registerHistory';
import visitorRoute from './api/visitor';
import department1 from './api/department1';
import department2 from './api/department2';
import hospitalAdmin from './api/hospitalAdmin';

export default function (app) {
  app.use('/init', initRoute);
  app.use('/auth/wechat', wechatRoute);
  app.use('/auth/users', usersRoute);
  app.use('/hospital', hospitalsRoute);
  app.use('/doctor', doctorRoute);
  app.use('/arrangement_history', arrangementHistoryRoute);
  app.use('/register_history', registerHistoryRoute);
  app.use('/visitor', visitorRoute);
  app.use('/department1', department1);
  app.use('/department2', department2);
  app.use('/hospital_admin', hospitalAdmin);
}
