
import config from 'config';

let RestServerConfig;

try {
  RestServerConfig = Object.assign({}, config.get('restServer'));
} catch (err) {
  if (!process.env.REST_SERVER_CONFIG) {
    throw new Error('Cannot get restServer from config, the config file may not exist. Provide this file or a value for REST_SERVER_CONFIG');
  }
  RestServerConfig = {};
}

if (process.env.REST_SERVER_CONFIG) {
  try {
    const restServerEnv = JSON.parse(process.env.REST_SERVER_CONFIG);
    // allow for them to only specify some fields
    RestServerConfig = Object.assign(RestServerConfig, restServerEnv);
  } catch (err) {
    console.error('Error getting rest config from env vars, using default');
  }
}

export default {
  RestServerConfig,
};
