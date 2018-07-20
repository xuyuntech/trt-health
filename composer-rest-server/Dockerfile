FROM hyperledger/fabric-baseimage:x86_64-0.4.6

WORKDIR /app

RUN npm init -y && npm install composer-admin@0.19.12 composer-common@0.19.12 composer-client@0.19.12  --registry=https://registry.npm.taobao.org && rm -rf package.json package-lock.json

COPY . .
RUN npm install 
RUN chmod +x cli.js
#--registry=https://registry.npm.taobao.org

CMD ./cli.js -c admin@trt-health -a true -w true -n never -m true
