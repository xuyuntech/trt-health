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

## (1)新建：需要访问 patient 接口的 POST 方法，传入的参数是 json 字符串，具体格式如下

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

## (2)查询：需要访问 patient 接口的 GET 方法，分为整体查询和带 '/name' 查询

整体查询实例结果：
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

带 '/xiaoming' 查询实例结果：
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

## (1)新建：需要访问 supplier 接口的 POST 方法，传入的参数是 json 字符串，具体格式如下

新建实例：
```
{
  "$class": "org.xuyuntech.health.Supplier",
  "id": "123",
  "name": "国药一号仓库",
  "address": "昆仑山脚",
  "zipCode": "5624523",
  "telephone": "1415532",
  "fax": "134215135135",
  "webSite": "www.kunlun.com"
}
```

## (2)查询：需要访问 supplier 接口的 GET 方法，分为整体查询和带 '/id' 查询

整体查询实例结果：
```
{
    "status": 0,
    "results": [
        {
            "$class": "org.xuyuntech.health.Supplier",
            "id": "123",
            "name": "国药一号仓库",
            "address": "昆仑山脚",
            "zipCode": "5624523",
            "telephone": "1415532",
            "fax": "134215135135",
            "webSite": "www.kunlun.com"
        },
        {
            "$class": "org.xuyuntech.health.Supplier",
            "id": "234",
            "name": "国药二号仓库",
            "address": "长白山",
            "zipCode": "5624523",
            "telephone": "1415532",
            "fax": "134215135135",
            "webSite": "www.changbaishan.com"
        }
    ]
}
```

带 '/123' 查询实例结果：
```
{
    "status": 0,
    "result": {
        "$class": "org.xuyuntech.health.Supplier",
        "id": "123",
        "name": "国药一号仓库",
        "address": "昆仑山脚",
        "zipCode": "5624523",
        "telephone": "1415532",
        "fax": "134215135135",
        "webSite": "www.kunlun.com"
    }
}
```

## (3)更新：需要访问 supplier 接口的 PUT 方法，需要带上 '/id'，传入的参数是 json 字符串，具体格式如下

带 '/123' 更新实例：修改 id 为 123 的供应商 "webSite"
```
{
    "$class": "org.xuyuntech.health.Supplier",
    "name": "国药一号仓库",
    "address": "昆仑山脚",
    "zipCode": "5624523",
    "telephone": "1415532",
    "fax": "134215135135",
    "webSite": "www.hahahahaha.com"
    }
```

# 3.medicalItems(药品的新建、查询、更新)

## (1)新建：需要访问 medicalItems 接口的POST方法，传入的参数是 json 字符串，具体格式如下

新建实例：
```
{
  "$class": "org.xuyuntech.health.MedicalItem",
  "id": "111",
  "title": "六味地黄丸",
  "quantity": 5000,
  "price": 50,
  "barcode": "12425123",
  "batchNumber": "152151",
  "permissionNumber": "154151",
  "productionDate": "2018-07-15T03:16:50.455Z",
  "expiredDate": "2018-07-15T03:16:50.455Z",
  "supplier": "resource:org.xuyuntech.health.Supplier#234"
}
```

## (2)查询：需要访问 medicalItems 接口的GET方法，分为整体查询和带 '/id' 查询

整体查询实例结果：
```
{
    "status": 0,
    "results": [
        {
            "$class": "org.xuyuntech.health.MedicalItem",
            "id": "111",
            "title": "六味地黄丸",
            "quantity": 5000,
            "price": 50,
            "barcode": "12425123",
            "batchNumber": "152151",
            "permissionNumber": "154151",
            "productionDate": "2018-07-15T03:16:50.455Z",
            "expiredDate": "2018-07-15T03:16:50.455Z",
            "supplier": {
                "$class": "org.xuyuntech.health.Supplier",
                "id": "234",
                "name": "国药二号仓库",
                "address": "长白山",
                "zipCode": "5624523",
                "telephone": "1415532",
                "fax": "134215135135",
                "webSite": "www.changbaishan.com"
            }
        },
        {
            "$class": "org.xuyuntech.health.MedicalItem",
            "id": "222",
            "title": "乌鸡白凤丸",
            "quantity": 6000,
            "price": 68,
            "barcode": "6796243",
            "batchNumber": "893452",
            "permissionNumber": "2626346",
            "productionDate": "2018-07-15T03:18:09.012Z",
            "expiredDate": "2018-07-15T03:18:09.012Z",
            "supplier": {
                "$class": "org.xuyuntech.health.Supplier",
                "id": "234",
                "name": "国药二号仓库",
                "address": "长白山",
                "zipCode": "5624523",
                "telephone": "1415532",
                "fax": "134215135135",
                "webSite": "www.changbaishan.com"
            }
        }
    ]
}
```

带 '/111' 查询实例结果：
```
{
    "status": 0,
    "result": {
        "$class": "org.xuyuntech.health.MedicalItem",
        "id": "111",
        "title": "六味地黄丸",
        "quantity": 5000,
        "price": 50,
        "barcode": "12425123",
        "batchNumber": "152151",
        "permissionNumber": "154151",
        "productionDate": "2018-07-15T03:16:50.455Z",
        "expiredDate": "2018-07-15T03:16:50.455Z",
        "supplier": {
            "$class": "org.xuyuntech.health.Supplier",
            "id": "234",
            "name": "国药二号仓库",
            "address": "长白山",
            "zipCode": "5624523",
            "telephone": "1415532",
            "fax": "134215135135",
            "webSite": "www.changbaishan.com"
        }
    }
}
```

## (3)更新：需要访问 medicalItems 接口的PUT方法，需要带上 '/id'，传入的参数是 json 字符串，具体格式如下

带 '/111' 更新实例：修改 id 为 111 的药品价格 "price"
```
{
  "$class": "org.xuyuntech.health.MedicalItem",
  "title": "六味地黄丸",
  "quantity": 5000,
  "price": 66,
  "barcode": "12425123",
  "batchNumber": "152151",
  "permissionNumber": "154151",
  "productionDate": "2018-07-15T03:16:50.455Z",
  "expiredDate": "2018-07-15T03:16:50.455Z",
  "supplier": "resource:org.xuyuntech.health.Supplier#234"
}
```

# 4.caseItem(病例的查询)

## 查询时需要访问 caseItem 接口的GET方法，分为整体查询和带 '/id' 查询

整体查询实例结果：
```
{
    "status": 0,
    "results": [
        {
            "$class": "org.xuyuntech.health.CaseItem",
            "id": "12",
            "complained": "发热、恶寒、咳嗽2天。",
            "diagnose": "因外出衣着不慎而始感头痛，鼻塞，时流清涕，微有咳嗽，发热。",
            "history": "平素身体尚可，未患过肺结核及肺炎，未患过肝炎，去年查肝功无异常。",
            "familyHistory": "母亲年过七旬，尚健。父因“脑出血”于1980年去世。",
            "created": "2018-07-15T03:28:35.928Z"
        },
        {
            "$class": "org.xuyuntech.health.CaseItem",
            "id": "13",
            "complained": "发热、咳嗽、头疼、无力",
            "diagnose": "因夜晚睡觉未盖被子而始感头痛，鼻塞，时流清涕，微有咳嗽，发热。",
            "history": "平素身体尚可，未患过肺结核及肺炎，未患过肝炎，去年查肝功无异常。",
            "familyHistory": "父母尚健。",
            "created": "2018-07-15T04:00:46.109Z"
        }
    ]
}
```

带 '/13' 查询实例结果：
```
{
    "status": 0,
    "result": {
        "$class": "org.xuyuntech.health.CaseItem",
        "id": "13",
        "complained": "发热、咳嗽、头疼、无力",
        "diagnose": "因夜晚睡觉未盖被子而始感头痛，鼻塞，时流清涕，微有咳嗽，发热。",
        "history": "平素身体尚可，未患过肺结核及肺炎，未患过肝炎，去年查肝功无异常。",
        "familyHistory": "父母尚健。",
        "created": "2018-07-15T04:00:46.109Z"
    }
}
```

# 5.order(订单的查询)

查询方式同caseItem

# 6.orderItem(订单明细的查询)

查询方式同caseItem

# 7.prescription(处方的查询)

查询方式同caseItem

# 8.paymentHistory(支付记录的查询)

查询方式同caseItem

# 9.outboundHistory(出库记录的查询)

查询方式同caseItem