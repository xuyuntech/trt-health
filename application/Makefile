all: push

container:
	docker build -t registry.cn-beijing.aliyuncs.com/xuyuntech/trt-health-application:latest .
push: container
	docker push registry.cn-beijing.aliyuncs.com/xuyuntech/trt-health-application:latest
restart:
	docker pull registry.cn-beijing.aliyuncs.com/xuyuntech/trt-health-application:latest
	docker rm -f trt-health-application || true
	docker run --restart -d -p 3002:3002 --name trt-health-application registry.cn-beijing.aliyuncs.com/xuyuntech/trt-health-application
