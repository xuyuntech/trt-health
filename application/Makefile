all: push

VERSION=$(shell node -e 'console.log(require("./package.json").version)')

IMAGE_NAME=registry.cn-beijing.aliyuncs.com/xuyuntech/trt-health-application:${VERSION}

container:
	docker build -t ${IMAGE_NAME} .
push: container
	docker push ${IMAGE_NAME}
restart:
	docker pull ${IMAGE_NAME}
	docker rm -f trt-health-application || true
	docker run --restart=always -d \
			-p 3002:3002 \
			-v /root/.composer:/root/.composer \
			-e NODE_ENV=production \
			--name trt-health-application \
			${IMAGE_NAME}
