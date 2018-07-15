trt-health
---

Role
组织管理员 -> 医院管理员
              -> 

participant
O 组织管理员
Y 医师
Y 患者
o 供应商
X 医院管理员

asset
Y 医院
Y 排班记录
Y 挂号单
Y 一级科室
Y 二级科室
Y 药品
Y 病例
Y 处方
Y 订单，订单明细
X 出库记录
X 支付记录

transaction
Y 挂号
Y 核销挂号单
X 支付挂号费
X 支付订单
Y 完成挂号单（开处方）
X 药品出库


新添接口功能如下：
---

# 1.patient(病人的新建、查询)

## (1)新建:需要访问patient接口的POST方法，传入的参数是 json 字符串

新建实例：
```
{
  "$class": "org.xuyuntech.health.Patient",
  "points": 0,
  "totalSpend": 200,
  "name": "xiaoming",
  "realName": "小明",
  "phone": "12425623521",
  "sid": "124",
  "email": "112@111.com",
  "address": "北京",
  "birthday": "12.09",
  "avatar": "string",
  "gender": "UNKNOW",
  "age": 30
}
```

## (2)查询：需要访问patient接口的GET方法，分为整体查询和带 '/name' 查询

整体查询实例：
```
{
    "status": 0,
    "results": [
        {
            "$class": "org.xuyuntech.health.Patient",
            "points": 0,
            "totalSpend": 500,
            "name": "xiaohong",
            "realName": "小红",
            "phone": "12425623521",
            "sid": "124",
            "email": "112@111.com",
            "address": "北京",
            "birthday": "10.09",
            "avatar": "string",
            "gender": "UNKNOW",
            "age": 28
        },
        {
            "$class": "org.xuyuntech.health.Patient",
            "points": 0,
            "totalSpend": 200,
            "name": "xiaoming",
            "realName": "小明",
            "phone": "12425623521",
            "sid": "124",
            "email": "112@111.com",
            "address": "北京",
            "birthday": "12.09",
            "avatar": "string",
            "gender": "UNKNOW",
            "age": 30
        }
    ]
}
```

带 '/xiaoming' 查询实例：
```
{
    "status": 0,
    "result": {
        "$class": "org.xuyuntech.health.Patient",
        "points": 0,
        "totalSpend": 200,
        "name": "xiaoming",
        "realName": "小明",
        "phone": "12425623521",
        "sid": "124",
        "email": "112@111.com",
        "address": "北京",
        "birthday": "12.09",
        "avatar": "string",
        "gender": "UNKNOW",
        "age": 30
    }
}
```

# 2.supplier(供应商的新建、查询、更新)

## (1)新建:需要访问patient接口的POST方法，传入的参数是 json 字符串

新建实例：

## (2)查询：需要访问patient接口的GET方法，分为整体查询和带 '/id' 查询

整体查询实例：


带 '/2' 查询实例：

## (3)更新：需要访问patient接口的PUT方法，需要带上 '/id'，传入的参数是 json 字符串

更新实例：

3.medicalItems(药品的新建、查询、更新)

4.caseItem(病例的查询)

5.order(订单的查询)

6.orderItem(订单明细的查询)

7.prescription(处方的查询)

8.paymentHistory(支付记录的查询)

9.outboundHistory(出库记录的查询)