/* eslint-disable import/prefer-default-export */
import config from 'config';

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

export const RestServerConfig = {
  ...restServerConfig,
};
