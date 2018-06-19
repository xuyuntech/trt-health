#!/bin/bash

COMPOSER_CARD=admin@trt-health
COMPOSER_NAMESPACES=never
COMPOSER_AUTHENTICATION=true
COMPOSER_MULTIUSER=true
COMPOSER_DATASOURCES='{
	"db": {
		"name": "db",
		"connector": "mongodb",
		"host": "127.0.0.1"
	}
}'
COMPOSER_PROVIDERS1='{
  "jwt": {
		"provider": "jwt",
		"module": "/home/composer/node_modules/custom-jwt.js",
		"secretOrKey": "gSi4WmttWuvy2ewoTGooigPwSDoxwZOy",
		"authScheme": "saml",
		"successRedirect": "/",
		"failureRedirect":"/"
  }
}'
COMPOSER_PROVIDERS='{
	"wechat": {
		"provider":"wechat",
		"session": false,
		"successRedirect":"http://wx-server.xuyuntech.com/auth/add_paticipant",
		"failureRedirect":"http://wx-server.xuyuntech.com/auth/failure",
		"passReqToCallback": true,
		"callbackPath":"/auth/wechat/callback",
		"module": "/root/trt-health/composer/passport-wechat.js",
		"clientID":"wx607464dd2b3f92a5",
		"clientSecret":"dbde02a150e545f797727c3995246682",
		"name":"wechat",
		"client":"wechat",
		"callbackURL":"http://api.trt-health.xuyuntech.com/auth/wechat/callback",
		"scope":"snsapi_userinfo",
		"state":"custom_state"
	}
}'

COMPOSER_CARD=$COMPOSER_CARD COMPOSER_NAMESPACES=never COMPOSER_AUTHENTICATION=true COMPOSER_MULTIUSER=true COMPOSER_PROVIDERS=${COMPOSER_PROVIDERS} COMPOSER_DATASOURCES=${COMPOSER_DATASOURCES} ./node_modules/composer-rest-server/cli.js
