import express from 'express';
import fetch from 'isomorphic-fetch';


// userID = bjtrt-ts01
// userSecret = kZYafhQWZnMw

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const res1 = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    if (res1.status === 401) {
      res.json({
        status: 1,
        err: '用户名或密码不正确',
      });
      return;
    }
    const data = await res1.json();
    res.json({
      status: 0,
      result: data,
    });
  } catch (err) {
    res.json({
      status: 1,
      err: `${err}`,
    });
  }
});

export default router;
