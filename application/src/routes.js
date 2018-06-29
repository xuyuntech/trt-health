import initRoute from './api/init';
import wechatRoute from './api/wechat';
import usersRoute from './api/users';
import hospitalsRoute from './api/hospitals';

export default function (app) {
  app.use('/init', initRoute);
  app.use('/auth/wechat', wechatRoute);
  app.use('/auth/users', usersRoute);
  app.use('/hospitals', hospitalsRoute);
}
