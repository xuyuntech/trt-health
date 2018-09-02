trt-health
---
* `composer` Hyperledger composer 运行相关的项目文件
* `fabric-dev-servers` Hyperledger fabric 各个链节点相关的文件
* `wechat` 微信登录相关的文件


### Deploy
---------

* fabric-dev-servers: startFabric.sh 启动环境(CA/Peer/Orderer/CouchDB),一键启动

* composer: `make composer` 打包当前项目为.bna二进制文件，安装部署到Fabric里面

	** composer/models/org.xuyuntech.health.cto: 类似“表结构”，数据实体关系图

	** composer/lib/*.js: 智能合约： 
```
/**
 * Remove all high volume commodities
 * @param1 {org.xuyuntech.health.RemoveHighQuantityCommodities} remove - the remove to be processed
 * @transaction1
 */
```
>
	* js里面的注释要跟CTO文件的transaction一一对应, 

	* transaction: 动作,事务

	* participant: 参与方,自然人

	* asset：资产,单据,库存

	* participant 通过 transaction 操作asset

	* acl文件，规定已存在用户的访问权限

	`make composer`成功之后，fabric里面启动了chaincode

* composer-rest-server:

	** `make mongo`, 部署mongodb

	** `make container`, 构建docker镜像

	** `make restart`, 启动rest server, release-1.0.0, postman测试

	** 可以修改auth规则，原型是loopback一个nodejs的框架

	** 给每个用户生成一个证书，导出后打成一个压缩包，存入mongodb，用户目录也会存一份

	附件：`composer-playground` 在服务器上，用浏览器访问

* application:
	
	** 前端访问application，它去访问restserver，返回结果

	** 小程序也是通过application访问后台

	** 自己添加，后续添加auth, audit, token

	** 直接访问fabric ca注册证书


### 以实现的功能
----------------

* 排班管理

* 用户挂号

* 确认挂号信息（核销）

* 开处方

* 支付（未接微信支付）

* 完成，修改订单状态

权限RBAC: 医师只能开处方，用户支付，库管取药，导诊台核销


