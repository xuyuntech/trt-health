FROM hyperledger/fabric-baseimage:x86_64-0.4.6

WORKDIR /app

COPY . .
RUN npm install --registry=https://registry.npm.taobao.org

CMD npm run build && npm start
