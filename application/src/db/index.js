import { MongoClient } from 'mongodb';
import log4js from 'log4js';

const logger = log4js.getLogger('db');
logger.level = 'debug';

const Models = {};
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/test';

let conn = null;

function initDB() {
  MongoClient.connect(mongoUrl, {
    poolSize: 10,
  }, (err, client) => {
    if (err) {
      logger.error('connect to mongodb err: ', err);
      return;
    }

    logger.info('connected to mongodb.');
    conn = client.db('test');
  });
}

async function getUserByAccessToken(accessToken) {
  return new Promise((resolve, reject) => {
    conn.collection('accessToken').find({ _id: accessToken }).toArray((err, docs) => {
      if (err) {
        logger.error('get accessToken err:', err);
        reject(err);
        return;
      }
      logger.debug('docs', docs);
      if (docs.length === 0) {
        resolve(null);
      } else if (docs.length === 1) {
        resolve(docs[0].userId);
      } else {
        reject(new Error(`get more than one user by access_token ${accessToken}`));
      }
    });
  });
}

async function getRoleById(roleId) {
  return new Promise((resolve) => {
    conn.collection('Role').find({ _id: roleId }).toArray((err, docs) => {
      if (err) {
        logger.error(`getRoleById ${roleId}] err: ${err}`);
        return;
      }
      logger.debug(`getRoleById ${roleId}: ${docs}`);
      resolve(docs[0]);
    });
  });
}

async function getRoleMappingByUserID(userID) {
  return new Promise((resolve) => {
    conn.collection('RoleMapping').find({ principalId: userID }).toArray((err, docs) => {
      if (err) {
        logger.error(`getRoleByUserID ${userID} err: ${err}`);
        return;
      }
      logger.debug(`getRoleByUserID ${userID}: `, docs);
      resolve(docs);
      // if (!docs.length) {
      //   resolve(null);
      //   return;
      // }
      // resolve(docs[0]);
    });
  });
}

export default {
  initDB,
  Models,
  conn: () => conn,
  getUserByAccessToken,
  getRoleMappingByUserID,
  getRoleById,
};
