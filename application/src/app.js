import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import WebSocket from 'ws';
import http from 'http';
import config from 'config';
import url from 'url';
import morgan from 'morgan';
import routes from './routes';
import { bfetch } from './api/utils';
import { API } from './const';

const app = express();
const server = http.createServer(app);
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  const userID = req.header('X-Access-UserID');
  try {
    const user = await bfetch(API.Users.FindByID(userID), {
      req,
    });
    req.currentUser = user;
    next();
  } catch (err) {
    res.json(err);
  }
});

routes(app);

let restServerConfig;

try {
  restServerConfig = Object.assign({}, config.get('restServer'));
} catch (err) {
  if (!process.env.REST_SERVER_CONFIG) {
    throw new Error('Cannot get restServer from config, the config file may not exist. Provide this file or a value for REST_SERVER_CONFIG');
  }
  restServerConfig = {};
}

if (process.env.REST_SERVER_CONFIG) {
  try {
    const restServerEnv = JSON.parse(process.env.REST_SERVER_CONFIG);
    // allow for them to only specify some fields
    restServerConfig = Object.assign(restServerConfig, restServerEnv);
  } catch (err) {
    console.error('Error getting rest config from env vars, using default');
  }
}
app.set('config', {
  restServer: restServerConfig,
});

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  const location = url.parse(ws.upgradeReq.url, true);
  console.log('client connected', location.pathname);
  const remoteURL = restServerConfig.webSocketURL + location.pathname;
  console.log('creating remote connection', remoteURL);
  const remote = new WebSocket(remoteURL);
  ws.on('close', (code, reason) => {
    console.log('client closed', location.pathname, code, reason);
    remote.close();
  });
  ws.on('message', (data) => {
    console.log('message from client', data);
    remote.send(data);
  });
  remote.on('open', () => {
    console.log('remote open', location.pathname);
  });
  remote.on('close', (code, reason) => {
    console.log('remote closed', location.pathname, code, reason);
    ws.close();
  });
  remote.on('message', (data) => {
    console.log('message from remote', data);
    ws.send(data);
  });

  remote.on('error', (data) => {
    console.log('AN ERROR OCCURED: ', data);
    ws.close();
  });
});


// start server on the specified port
server.listen(3002, () => {
  // print a message when the server starts listening
  console.log('server starting on http://localhost:3002');
});
