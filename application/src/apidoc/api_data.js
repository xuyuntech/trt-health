define({ "api": [
  {
    "type": "get",
    "url": "/",
    "title": "Request HospitalAdmin information",
    "name": "GetHospitalAdmin",
    "group": "HospitalAdmin",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "int",
            "optional": false,
            "field": "status",
            "description": "<p>status of res.</p>"
          },
          {
            "group": "Success 200",
            "type": "list",
            "optional": false,
            "field": "results",
            "description": "<p>results of res.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"status\": 0,\n   \"results\": [\n         {\n           \"$class\": \"org.xuyuntech.health.HospitalAdmin\",\n           \"creator\": \"resource:org.xuyuntech.health.OrgAdmin#2705\",\n           \"name\": \"1457\"\n         }\n              ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Not Found\n  {\n        \"status\": 401,\n        \"err\": \"Unauthorized\"\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/hospitalAdmin/index.js",
    "groupTitle": "HospitalAdmin"
  },
  {
    "type": "post",
    "url": "/",
    "title": "post HospitalAdmin information",
    "name": "postHospitalAdmin",
    "group": "HospitalAdmin",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>name of HospitalAdmin</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "realName",
            "description": "<p>realName of HospitalAdmin</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "phtone",
            "description": "<p>phone of HospitalAdmin</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "sid",
            "description": "<p>sid of HospitalAdmin</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>email of HospitalAdmin</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "address",
            "description": "<p>address of HospitalAdmin</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "birthday",
            "description": "<p>birthday of HospitalAdmin</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "avatar",
            "description": "<p>avatar of HospitalAdmin</p>"
          },
          {
            "group": "Parameter",
            "type": "enum",
            "optional": false,
            "field": "gender",
            "description": "<p>gender of HospitalAdmin   UNKNOW MALE FEMALE</p>"
          },
          {
            "group": "Parameter",
            "type": "double",
            "optional": false,
            "field": "age",
            "description": "<p>age of HospitalAdmin</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n      \"status\": 0,\n      \"result\": {\n          \"$class\": \"org.xuyuntech.health.HospitalAdmin\",\n          \"creator\": \"resource:org.xuyuntech.health.OrgAdmin#trt-admin\",\n          \"name\": \"zhangsan\",\n          \"realName\": \"string\",\n          \"phone\": \"string\",\n          \"sid\": \"string\",\n          \"email\": \"string\",\n          \"address\": \"string\",\n          \"birthday\": \"string\",\n          \"avatar\": \"string\",\n          \"gender\": \"UNKNOW\",\n          \"age\": 0\n      }\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Not Found\n  {\n        \"status\": 401,\n        \"err\": \"Unauthorized\"\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/hospitalAdmin/index.js",
    "groupTitle": "HospitalAdmin"
  },
  {
    "type": "put",
    "url": "/finish/:id",
    "title": "put Order/finish/:id",
    "name": "put_Order_finish__id_",
    "group": "Order",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Order unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n    {\n        \"status\": 0,\n        \"result\": {\n            \"$class\": \"org.xuyuntech.health.FinishAction\",\n            \"id\": \"2d033ae0-88d8-11e8-a8df-574842ac90c5\",\n            \"created\": \"2018-07-16T09:11:08.430Z\",\n            \"order\": \"resource:org.xuyuntech.health.Order#3c7c3f20-88d4-11e8-a32d-b7f577b21831\",\n            \"storekeeper\": \"resource:org.xuyuntech.health.StoreKeeper#trt-admin\",\n            \"transactionId\": \"d018700895a1e5e99cf3360e35c9119e1faeabfa657cf80d40129cce4842b372\"\n        }\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Not Found\n  {\n        \"status\": 401,\n        \"err\": \"Unauthorized\"\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/order/index.js",
    "groupTitle": "Order"
  },
  {
    "type": "put",
    "url": "/paid/:id",
    "title": "Order/paid/:id",
    "name": "put_Order_paid__id_",
    "group": "Order",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Order unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n    {\n        \"status\": 0,\n        \"result\": {\n            \"$class\": \"org.xuyuntech.health.PayAction\",\n            \"id\": \"d1c20620-88d7-11e8-a8df-574842ac90c5\",\n            \"created\": \"2018-07-16T09:08:35.330Z\",\n            \"order\": \"resource:org.xuyuntech.health.Order#3c7c3f20-88d4-11e8-a32d-b7f577b21831\",\n            \"transactionId\": \"ada299db17eeb01e3edb01b2980e776cdf68c4d1ff888e6badf539f52f1999d8\"\n        }\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Not Found\n  {\n        \"status\": 401,\n        \"err\": \"Unauthorized\"\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/order/index.js",
    "groupTitle": "Order"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "src/apidoc/main.js",
    "group": "_home_windghoul_gitProject_trt_health_application_src_apidoc_main_js",
    "groupTitle": "_home_windghoul_gitProject_trt_health_application_src_apidoc_main_js",
    "name": ""
  },
  {
    "type": "put",
    "url": "/finish/:id",
    "title": "finish",
    "name": "put_registerHistory_finish__id",
    "group": "registerHistory",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>registerHistory unique ID.</p>"
          },
          {
            "group": "Parameter",
            "type": "double",
            "optional": false,
            "field": "points",
            "description": "<p>points of patient</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "complained",
            "description": "<p>complained of patient for caseItem</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "diagnose",
            "description": "<p>diagnose of patient for caseItem</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "history",
            "description": "<p>history of patient for caseItem</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "familyHistory",
            "description": "<p>familyHistory of patient for caseItem</p>"
          },
          {
            "group": "Parameter",
            "type": "medicallistform",
            "optional": false,
            "field": "medicallistform",
            "description": "<p>medicallistform</p>"
          },
          {
            "group": "Parameter",
            "type": "list",
            "optional": false,
            "field": "form",
            "description": "<p>{&quot;medicalItem&quot;:&quot;resource:org.xuyuntech.health.MedicalItem#1&quot;,&quot;count&quot;:10}</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n  {\n      \"status\": 0,\n      \"result\": {\n          \"$class\": \"org.xuyuntech.health.FinishRegisterAction\",\n          \"registerHistory\":\n          \"resource:org.xuyuntech.health.RegisterHistory#7df02540-88d2-11e8-a32d-b7f577b21831\",\n          \"id\": \"3c7c3f20-88d4-11e8-a32d-b7f577b21831\",\n          \"points\": 25,\n          \"complained\": \"病例描述病例描述病例描述病例描述\",\n          \"diagnose\": \"病例描述病例描述病例描述病例描述病例描述\",\n          \"history\": \"病例描述病例描述病例描述病例描述病例描述\",\n          \"familyHistory\": \"病例描述病例描述病例描述病例描述病例描述\",\n          \"created\": \"2018-07-16T08:42:56.402Z\",\n          \"medicallistform\": [\n              {\n                  \"$class\": \"org.xuyuntech.health.MedicalListForm\",\n                  \"medicalItem\": \"resource:org.xuyuntech.health.MedicalItem#1\",\n                  \"count\": 10\n              },\n              {\n                  \"$class\": \"org.xuyuntech.health.MedicalListForm\",\n                  \"medicalItem\": \"resource:org.xuyuntech.health.MedicalItem#2\",\n                  \"count\": 5\n              }\n          ],\n          \"transactionId\": \"7124c5d67c015bd79813481345292256a9db82c2908b7acaf0de7c0fca206958\"\n      }\n  }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Not Found\n  {\n        \"status\": 401,\n        \"err\": \"Unauthorized\"\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/registerHistory/index.js",
    "groupTitle": "registerHistory"
  },
  {
    "type": "put",
    "url": "/paid/:id",
    "title": "paid",
    "name": "put_registerHistory_paid__id_",
    "group": "registerHistory",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>registerHistory unique ID.</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n    {\n        \"status\": 0,\n        \"result\": {\n            \"$class\": \"org.xuyuntech.health.PayRegisterAction\",\n            \"registerHistory\": \"7df02540-88d2-11e8-a32d-b7f577b21831\",\n            \"transactionId\": \"05529497180864005a452c0c2d1bc6822503938177db38e54758b7545af47a8a\"\n        }\n    }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Not Found\n  {\n        \"status\": 401,\n        \"err\": \"Unauthorized\"\n  }",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/registerHistory/index.js",
    "groupTitle": "registerHistory"
  }
] });
