FROM hyperledger/fabric-baseimage:x86_64-0.4.6

WORKDIR /app

COPY . .
RUN chmod +x cli.js
RUN npm install 
#--registry=https://registry.npm.taobao.org

CMD ./cli.js -c admin@trt-health -a true -w true -n never -m true
