/* eslint-disable import/prefer-default-export */

import { BusinessNetworkConnection } from 'composer-client';


export const participantExists = async (id, className) => {
  const businessNetworkConnection = new BusinessNetworkConnection();

  try {
    await businessNetworkConnection.connect('admin@trt-health');
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(className);
    const exists = await participantRegistry.exists(id);
    await businessNetworkConnection.disconnect();
    return exists;
  } catch (error) {
    console.log('participantExists error:>');
    console.error(error);
    throw error;
  }
};
