import express from 'express';
import fetch from 'isomorphic-fetch';
import { addParticipantIdentity } from '../utils';
import { API } from '../../const';


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
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const res1 = await fetch(API.Auth.WechatCallback(code));
    const data = await res1.json();
    const { accessToken, userID } = data.result;
    res.json({
      status: 0,
      result: {
        accessToken,
        userID,
      },
    });
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});
router.post('/reg', async (req, res) => {
  const accessToken = req.header('X-Access-Token');
  const userID = req.header('X-Access-UserID');
  const { userInfo } = req.body;
  const { nickName, gender, avatarUrl } = userInfo;
  try {
    const currentUserRes = await fetch(API.Users.FindByID(userID), { headers: { 'X-Access-Token': accessToken } });
    if (currentUserRes.status !== 200) {
      throw new Error(`get current user failed: ${currentUserRes.statusText}`);
    }
    const currentUser = await currentUserRes.json();
    await addParticipantIdentity({
      currentCardName: 'admin@trt-health',
      username: currentUser.username,
      accessToken,
      resourceType: 'Patient',
      participantData: {
        realName: nickName,
        avatar: avatarUrl,
        gender: gender === 1 ? 'MALE' : 'FEMALE',
      },
    });
    console.log('add Patient done');
    res.json({
      status: 0,
      result: {
        email: currentUser.email,
        username: currentUser.username,
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
