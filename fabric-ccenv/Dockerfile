FROM ibmblockchain/fabric-baseimage:0.4.6
COPY payload/chaintool payload/protoc-gen-go /usr/local/bin/
ADD payload/goshim.tar.bz2 $GOPATH/src/
RUN mkdir -p /chaincode/input /chaincode/output
RUN npm set registry https://registry.npm.taobao.org
RUN cd /chaincode/output && npm install composer-common@0.19.8 composer-runtime-hlfv1@0.19.8
LABEL org.hyperledger.fabric.version=1.1.0 \
      org.hyperledger.fabric.base.version=0.4.6
