#!/bin/bash
composer card create -p connection.json -u PeerAdmin -c Admin@org1.example.com-cert.pem -k 114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk -r PeerAdmin -r ChannelAdmin
composer card import -f PeerAdmin@trt-health.card
composer archive create -t dir -n .
composer network install -c PeerAdmin@trt-health -a trt-health@${VERSION}.bna -o npmrcFile=`pwd`/.npmrc
composer network start --networkName trt-health --networkVersion ${VERSION} -A admin -S adminpw -c PeerAdmin@trt-health -o npmrcFile=`pwd`/.npmrc
composer card import -f admin@trt-health.card
composer network ping -c admin@trt-health
