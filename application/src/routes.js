import initRoute from './api/init';

export default function (app) {
  app.use('/init', initRoute);
}
