'use strict';
/* eslint-disable */
var util = require('util');
var passport = require('passport-strategy');
// var OAuth = require('wechat-oauth');
var debug = require('debug')('passport-wechat');
var fetch = require('isomorphic-fetch');
var extend = require("xtend");
debug = console.log;
function WechatStrategy(options, verify){
  options = options || {};

  if (!verify) {
    throw new TypeError('WeChatStrategy required a verify callback');
  }

  if (typeof verify !== 'function') {
    throw new TypeError('_verify must be function');
  }

  if (!options.clientID) {
    throw new TypeError('WechatStrategy requires a clientID option');
  }

  if (!options.clientSecret) {
    throw new TypeError('WechatStrategy requires a clientSecret option');
  }

  passport.Strategy.call(this, options, verify);

  this.name = options.name || 'wechat';
  this._client = options.client || 'wechat';
  this._verify = verify;
  this._clientID = options.clientID;
  this._clientSecret = options.clientSecret;
  // this._oauth = new OAuth(options.clientID, options.clientSecret, options.getToken, options.saveToken);
  this._callbackURL = options.callbackURL;
  this._lang = options.lang || 'en';
  this._state = options.state;
  this._scope = options.scope || 'snsapi_userinfo';
  this._passReqToCallback = options.passReqToCallback;
}

util.inherits(WechatStrategy, passport.Strategy);

WechatStrategy.prototype.authenticate = function(req, options){

  if (!req._passport) {
    return this.error(new Error('passport.initialize() middleware not in use'));
  }

  var self = this;

  options = options || {};

  // 获取code,并校验相关参数的合法性
  // No code only state --> User has rejected send details. (Fail authentication request).
  if (req.query && req.query.state && !req.query.code) {
    return self.fail(401);
  }

  // Documentation states that if user rejects userinfo only state will be sent without code
  // In reality code equals "authdeny". Handle this case like the case above. (Fail authentication request).
  if (req.query && req.query.code === 'authdeny') {
    return self.fail(401);
  }

  // 获取code授权成功
  if (!req.query || !req.query.code) {
    return self.error('no code');
  }

  // 校验完成信息
  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    self.success(user, info);
  }

  var code = req.query.code;
  // 通过 code 获取 openid 和 session_key

  fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${this._clientID}&secret=${this._clientSecret}&js_code=${code}&grant_type=authorization_code`)
    .then(function(response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
    .then(function(data) {
      const { openid, session_key } = data;
      self._verify(req, openid, data, verified);
    });

}

module.exports = WechatStrategy;
