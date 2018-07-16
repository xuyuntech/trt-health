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
          "content": "HTTP/1.1 200 OK\n{\n   \"status\": 0,\n   \"results\": [\n         {\n               \"$class\": \"org.xuyuntech.health.HospitalAdmin\",\n               \"creator\": \"resource:org.xuyuntech.health.OrgAdmin#2705\",\n              \"name\": \"1457\"\n        }\n              ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/api/hospitalAdmin/index.js",
    "groupTitle": "HospitalAdmin"
  }
] });
