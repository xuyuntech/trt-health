VERSION=0.0.9


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