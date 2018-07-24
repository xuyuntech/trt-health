import redis from 'redis';
import SMSClient from '@alicloud/sms-sdk';
import { promisify } from 'util';
import express from 'express';
import setCodes from '../../SMS';


const client = redis.createClient('6379', 'localhost');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const expireAsync = promisify(client.expire).bind(client);
const ttlAsync = promisify(client.ttl).bind(client);
const existsAsync = promisify(client.exists).bind(client);
const delAsync = promisify(client.del).bind(client);
const router = express.Router();

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = '';
const secretAccessKey = '';
// 初始化sms_client
const smsClient = new SMSClient({ accessKeyId, secretAccessKey });

const ErrRedisConnect = { status: 1, err: '错误的redis连接' };
const ErrWrongCodes = { status: 1, err: '不正确的验证码或者您的验证码已过期' };
const ErrWrongPhoneNum = { status: 1, err: '不正确的手机号或者您的验证码已过期' };


router.post('/setCodes', async (req, res) => {
  let exists;
  let timettl;
  // 状态检查，检查redis数据库是否连接正常。
  try {
    client.on('ready', (r) => {
      console.log(r);
    });
    client.on('error', () => {
      throw ErrRedisConnect;
    });
  } catch (error) {
    res.json(error);
    return;
  }

  try {
    exists = await existsAsync(req.body.phoneNum);
    timettl = await ttlAsync(req.body.phoneNum);
  } catch (error) {
    res.json(error);
    return;
  }
  console.log(timettl);
  try {
    if (!exists || (timettl <= 0)) {
      const codes = setCodes();
      console.log(codes);
      await setAsync(req.body.phoneNum, codes);
      await expireAsync(req.body.phoneNum, 300);
    }
  } catch (error) {
    res.json(error);
  }

  try {
    const codes = await getAsync(req.body.phoneNum);
    console.log(codes);// 此处为了之后加入短信调用接口准备，将验证码提取出来，并且打印到控制台上。
    smsClient.sendSMS({
      PhoneNumbers: req.body.phoneNum,
      SignName: '阿里云短信测试专用',
      TemplateCode: 'SMS_140085313',
      TemplateParam: `{"code":${codes},"prodect":"xuyuntech"}`,
    }).then((re) => {
      const { Code } = re;
      if (Code === 'OK') {
        // 处理返回参数
        console.log(re);
      }
    }, (err) => {
      throw err;
    });
  } catch (error) {
    res.json(error);
  }


  res.json({
    state: 0,
    result: 'SUCCESS',
  });
});

router.put('/verifyCodes', async (req, res) => {
  let exists;
  let codes;
  try {
    exists = await existsAsync(req.body.phoneNum);
    codes = await getAsync(req.body.phoneNum);
  } catch (error) {
    res.json(error);
    return;
  }
  try {
    if (exists) {
      if (codes !== req.body.codes) {
        throw ErrWrongCodes;
      } else {
        await delAsync(req.body.phoneNum);
        res.json({
          state: 0,
          result: 'SUCCESS',
        });
      }
    } else {
      throw ErrWrongPhoneNum;
    }
  } catch (error) {
    res.json(error);
  }
});

export default router;
