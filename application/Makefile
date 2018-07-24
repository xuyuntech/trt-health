all: push

# VERSION=$(shell node -e 'console.log(require("./package.json").version)')
VERSION=1.0.1

IMAGE_NAME=registry.cn-beijing.aliyuncs.com/xuyuntech/trt-health-application:${VERSION}

HOST_IP=10.6.29.108

REST_SERVER_CONFIG='{ \
	"webSocketURL": "ws://${HOST_IP}:3000", \
	"httpURL": "${HOST_IP}:3000" \
}'

container:
	docker build -t ${IMAGE_NAME} .
push: container
	docker push ${IMAGE_NAME}
restart:
	docker pull ${IMAGE_NAME}
	docker rm -f trt-health-application || true
	docker run --restart=always -d \
			-p 3002:3002 \
			--add-host orderer.example.com:${HOST_IP} --add-host peer0.org1.example.com:${HOST_IP} --add-host ca.org1.example.com:${HOST_IP} \
			-e REST_SERVER_CONFIG=${REST_SERVER_CONFIG} \
			-v /root/.composer:/root/.composer \
			-e NODE_ENV=production \
			--name trt-health-application \
			${IMAGE_NAME}
apidoc:
	apidoc -i src/ -o src/apidoc/ 
redis:
	docker rm -f redis|| true
	docker run --name redis -d  --network composer_default -p 6379:6379 redis
