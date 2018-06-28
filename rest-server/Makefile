

COMPOSER_PROVIDERS_TEST='{ \
	"local": { \
		"provider": "local",  \
    "module": "passport-local",  \
    "usernameField": "username",  \
    "passwordField": "password",  \
    "authPath": "/auth/local",  \
    "successRedirect": "/",  \
    "failureRedirect": "/",  \
    "setAccessToken": true,  \
		"passReqToCallback": false \
	}, \
	"jwt": { \
		"provider": "jwt", \
		"session": false, \
		"module": "../../../passport-jwt.js", \
		"secretOrKey": "gSi4WmttWuvy2ewoTGooigPwSDoxwZOy", \
		"authScheme": "saml", \
		"successRedirect": "http://localhost:3002/init/auth_success", \
		"failureRedirect":"http://localhost:3002/init/auth_failure" \
  }, \
	"wechat": { \
		"provider":"wechat", \
		"session": false, \
		"module": "../../../passport-wechat.js", \
		"clientID":"wx149a1255ff3dbc5f", \
		"clientSecret":"c781e5fcd8d08c911bea5e91e7d8cb07", \
		"successRedirect":"http://localhost:3001/auth/callback", \
		"realm":"http://localhost:3001" \
	} \
}'

# "wechat": { \
	# 	"provider":"wechat", \
	# 	"successRedirect":"http://localhost:3001/auth/add_participant", \
	# 	"failureRedirect":"http://localhost:3001/auth/failure", \
	# 	"passReqToCallback": true, \
	# 	"callbackPath":"/auth/wechat/callback", \
	# 	"module": "../../../passport-wechat.js", \
	# 	"clientID":"wx149a1255ff3dbc5f", \
	# 	"clientSecret":"c781e5fcd8d08c911bea5e91e7d8cb07", \
	# 	"name":"wechat", \
	# 	"client":"wechat", \
	# 	"callbackURL":"http://api.trt-health.xuyuntech.com/auth/wechat/callback", \
	# 	"scope":"snsapi_userinfo", \
	# 	"state":"custom_state" \
	# } \


COMPOSER_DATASOURCES='{ \
	"db": { \
		"name": "db", \
		"connector": "mongodb", \
		"host": "localhost" \
	} \
}'

rest:
	COMPOSER_CARD=admin@trt-health COMPOSER_NAMESPACES=never COMPOSER_AUTHENTICATION=true COMPOSER_MULTIUSER=true COMPOSER_PROVIDERS='${COMPOSER_PROVIDERS}' COMPOSER_DATASOURCES='${COMPOSER_DATASOURCES}' ./node_modules/composer-rest-server/cli.js
rest-test:
	COMPOSER_CARD=admin@trt-health COMPOSER_NAMESPACES=never COMPOSER_AUTHENTICATION=true COMPOSER_MULTIUSER=true COMPOSER_PROVIDERS=${COMPOSER_PROVIDERS_TEST} COMPOSER_DATASOURCES=${COMPOSER_DATASOURCES} ./node_modules/composer-rest-server/cli.js
rest-noauth:
	COMPOSER_CARD=admin@trt-health COMPOSER_NAMESPACES=never COMPOSER_MULTIUSER=true COMPOSER_DATASOURCES=${COMPOSER_DATASOURCES} ./node_modules/composer-rest-server/cli.js


mongo:
	docker rm -f mongo || true
	docker run -d --name mongo --network composer_default -p 27017:27017 mongo

rest-build:
	docker build -t localhost/composer-rest-server .
