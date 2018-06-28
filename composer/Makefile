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
		"module": "../../../passport-jwt.js", \
		"secretOrKey": "gSi4WmttWuvy2ewoTGooigPwSDoxwZOy", \
		"authScheme": "saml", \
		"successRedirect": "http://localhost:3001/register/callback", \
		"failureRedirect":"http://localhost:3001/auth/failure" \
  }, \
	"wechat": { \
		"provider":"wechat", \
		"successRedirect":"http://wx-server.xuyuntech.com/auth/add_paticipant", \
		"failureRedirect":"http://wx-server.xuyuntech.com/auth/failure", \
		"passReqToCallback": true, \
		"callbackPath":"/auth/wechat/callback", \
		"module": "../../../passport-wechat.js", \
		"clientID":"wx607464dd2b3f92a5", \
		"clientSecret":"dbde02a150e545f797727c3995246682", \
		"name":"wechat", \
		"client":"wechat", \
		"callbackURL":"http://api.trt-health.xuyuntech.com/auth/wechat/callback", \
		"scope":"snsapi_userinfo", \
		"state":"custom_state" \
	} \
}'

COMPOSER_DATASOURCES='{ \
	"db": { \
		"name": "db", \
		"connector": "mongodb", \
		"host": "localhost" \
	} \
}'

VERSION=$(shell node -e 'console.log(require("./package.json").version)')

test:
	BASEDIR=${BASEDIR} TEST_NAME=${COMPOSER_PROVIDERS_TEST} echo ${TEST_NAME} 

nginx:
	docker rm -f nginx || true
	docker run \
		--name nginx \
		-d \
		-v `pwd`/conf.d:/etc/nginx/conf.d \
		-p 80:80 \
		--network composer_default \
		nginx 

importAdmin:
	rm -rf ~/.composer
	composer card create -p connection.json -u PeerAdmin -c Admin@org1.example.com-cert.pem -k 114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk -r PeerAdmin -r ChannelAdmin
	composer card import -f PeerAdmin@trt-health.card
install-network:
	composer archive create -t dir -n .
	composer network install -c PeerAdmin@trt-health -a trt-health@${VERSION}.bna -o npmrcFile=`pwd`/.npmrc
upgrade-network: install-network
	composer network upgrade -c PeerAdmin@trt-health -n trt-health -V ${VERSION} -o npmrcFile=`pwd`/.npmrc
composer: importAdmin install-network
	sleep 5s
	composer network start --networkName trt-health --networkVersion ${VERSION} -A admin -S adminpw -c PeerAdmin@trt-health -o npmrcFile=`pwd`/.npmrc
	sleep 5s
	composer card import -f admin@trt-health.card
	composer network ping -c admin@trt-health

rest-server:
	composer-rest-server -c admin@trt-health -n never -w true