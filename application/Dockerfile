FROM hyperledger/fabric-baseimage:x86_64-0.4.6

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build
CMD npm start
