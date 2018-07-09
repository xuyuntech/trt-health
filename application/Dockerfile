FROM hyperledger/fabric-baseimage:x86_64-0.4.6

WORKDIR /app

RUN npm init -y && npm install composer-admin composer-common composer-client && rm -rf package.json package-lock.json

COPY . .
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run build
CMD npm start
