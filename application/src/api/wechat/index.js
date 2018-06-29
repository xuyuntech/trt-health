import express from 'express';
import fetch from 'isomorphic-fetch';
import { addParticipantIdentity } from '../utils';


// userID = bjtrt-ts01
// userSecret = kZYafhQWZnMw

const router = express.Router();

router.get('/success', async (req, res) => {
  const accessToken = req.query['access-token'];
  const userID = req.query['user-id'];
  res.json({
    status: 0,
    result: {
      accessToken,
      userID,
    },
  });
});
router.post('/reg', async (req, res) => {
  const accessToken = req.header('X-Access-Token');
  const userID = req.header('X-Access-UserID');
  try {
    const currentUserRes = await fetch(`http://localhost:3000/api/users/${userID}`, { headers: { 'X-Access-Token': accessToken } });
    if (currentUserRes.status !== 200) {
      throw new Error(`get current user failed: ${currentUserRes.statusText}`);
    }
    const currentUser = await currentUserRes.json();
    await addParticipantIdentity({
      currentCardName: 'admin@trt-health', username: currentUser.username, accessToken, resourceType: 'Patient',
    });
    console.log('add Patient done');
    res.json({
      status: 0,
      result: {
        accessToken,
        userID,
      },
    });
  } catch (error) {
    console.log(`add Patient error:> ${error}`);
    res.json({
      status: 1,
      err: `${error}`,
    });
  }
});

export default router;
