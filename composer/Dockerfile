FROM hyperledger/composer-rest-server:0.19.9

RUN npm install --production loopback-connector-mongodb passport-jwt passport-strategy wechat-oauth xtend && \
    npm cache clean --force && \
    ln -s node_modules .node_modules

COPY custom-jwt.js node_modules/custom-jwt.js
COPY passport-wechat.js node_modules/passport-wechat.js
# COPY .composer /home/composer/.composer
