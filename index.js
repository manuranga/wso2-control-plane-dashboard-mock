const express = require('express');
var proxy = require('express-http-proxy');

const app = express();

app.get('/conf/config.js', (req, res) => {
  res.send('window.sso = { enable: false, config: { clientID: "", resourceServerURLs: [], signInRedirectURL: "", storage: "webWorker", }, usernameAttribute: "sub", adminGroupAttribute: "", allowedAdminGroups: [], }; ');
});

app.post('/dashboard/api/login', (req, res) => {
  res.send('{"scope":"admin","sso":false,"username":"admin"}');
});


app.get('/dashboard/api/configs/super-admin', (req, res) => {
  res.send('{"username":"admin"}');
});

app.get('/dashboard/api/groups', (req, res) => {
  res.send('["dev", "prod"]');
});

// https://manu.local:9743/dashboard/api/groups/mi_dev/nodes?lowerLimit=0&upperLimit=5
// {"count":2,"resourceList":[{"details":"{\"productVersion\":\"4.2.0\",\"osVersion\":\"13.5.2\",\"javaVersion\":\"17.0.7\",\"carbonHome\":\"/Users/manu/Downloads/wso2mi-4.2.0\",\"javaVendor\":\"Eclipse Adoptium\",\"osName\":\"Mac OS X\",\"productName\":\"WSO2 Micro Integrator\",\"javaHome\":\"/Library/Ballerina/dependencies/jdk-17.0.7+7-jre\"}","nodeId":"dev_node_2","status":"healthy"},{"details":"{\"productVersion\":\"4.2.0\",\"osVersion\":\"13.5.2\",\"javaVersion\":\"17.0.7\",\"carbonHome\":\"/Users/manu/Downloads/wso2mi-4.2.0 2\",\"javaVendor\":\"Eclipse Adoptium\",\"osName\":\"Mac OS X\",\"productName\":\"WSO2 Micro Integrator\",\"javaHome\":\"/Library/Ballerina/dependencies/jdk-17.0.7+7-jre\"}","nodeId":"dev_node_1","status":"healthy"}]}

const miDetailsCommon = {
  productVersion: "4.2.0",
  osVersion: "13.5.2",
  javaVersion: "17.0.7",
  javaVendor: "Eclipse Adoptium",
  osName: "Mac OS X",
  productName: "WSO2 Micro Integrator",
  javaHome: "/Library/Ballerina/dependencies/jdk-17.0.7+7-jre"
};

const balDetailsCommon = {
  "platformName": "ballerina",
  "platformVersion": "Ballerina 2201.9.0 (Ballerina Swan Lake Update 9)",
  "ballerinaHome": "/Users/Ballerna/ballerina-2201.9.0",
  "osName": "Mac OS X",
  "osVersion": "10.15.4"
};

app.get('/dashboard/api/groups/:group/nodes', (req, res) => {
   const group = req.params.group;
   const nodeArr = getNodeDetailsArr(group);
   const json = {
      count: nodeArr.length,
      resourceList: nodeArr
   };
   res.send(JSON.stringify(json));
});

function getNodeDetailsArr(group) {
   if (group === "prod") {
    return [
        {
          details: JSON.stringify({ ...miDetailsCommon, carbonHome: "/Users/manu/Downloads/wso2mi-4.2.0" }),
          nodeId: 'prod_node_1',
          type: 'mi',
          status: 'healthy'
        },
        {
          details: JSON.stringify({ ...miDetailsCommon, carbonHome: "/Users/manu/Downloads/wso2mi-4.2.0_2" }),
          nodeId: 'prod_node_2',
          type: 'mi',
          status: 'healthy'
        },
        {
          details: JSON.stringify( balDetailsCommon),
          nodeId: 'prod_node_3',
          type: 'bal',
          status: 'healthy'
        },
        {
          details: JSON.stringify( balDetailsCommon),
          nodeId: 'prod_node_4',
          type: 'bal',
          status: 'healthy'
        }

      ]
   }
   else if (group === "dev") {
      return [
        {
          details: JSON.stringify({ ...miDetailsCommon, carbonHome: "/Users/manu/Downloads/wso2mi-4.2.0" }),
          nodeId: 'dev_node_1',
          type: 'mi',
          status: 'healthy'
        },
        {
          details: JSON.stringify({ ...miDetailsCommon, carbonHome: "/Users/manu/Downloads/wso2mi-4.2.0_2" }),
          nodeId: 'dev_node_2',
          type: 'mi',
          status: 'healthy'
        },
        {
          details: JSON.stringify({ ...miDetailsCommon, carbonHome: "/Users/manu/Downloads/wso2mi-4.2.0_3" }),
          nodeId: 'dev_node_3',
          type: 'mi',
          status: 'healthy'
        },
        {
          details: JSON.stringify( balDetailsCommon),
          nodeId: 'dev_node_4',
          type: 'bal',
          status: 'healthy'
        },
        {
          details: JSON.stringify( balDetailsCommon),
          nodeId: 'dev_node_5',
          type: 'bal',
          status: 'healthy'
        },
        {
          details: JSON.stringify( balDetailsCommon),
          nodeId: 'dev_node_6',
          type: 'bal',
          status: 'healthy'
        }
      ];
   }
   else {
      return null;
   }
};

app.get('/dashboard/api/groups/:group/proxy-services', (req, res) => {
  res.send('{"count":0,"resourceList":[]}');
});

app.get('/dashboard/api/groups/:group/all-nodes', (req, res) => {
  const group = req.params.group;
  const nodeArr = getNodeDetailsArr(group);
  res.send(JSON.stringify(nodeArr));
});

// https://manu.local:9743/dashboard/api/groups/mi_dev/apis?nodes=dev_node_1&nodes=dev_node_2&searchKey=&lowerLimit=0&upperLimit=5&order=asc&orderBy=name&isUpdate=false
// {"count":1,"resourceList":[{"name":"HelloWorld","nameIgnoreCase":"helloworld","nodes":[{"details":"{\"tracing\":\"disabled\",\"stats\":\"disabled\",\"port\":-1,\"name\":\"HelloWorld\",\"context\":\"/HelloWorld\",\"resources\":[{\"methods\":[\"GET\"],\"url\":\"N/A\"}],\"version\":\"N/A\",\"url\":\"http://localhost:8290/HelloWorld\"}","nodeId":"dev_node_2"}]}]}
app.get('/dashboard/api/groups/:group/apis', (req, res) => {
  const nodes = req.query.nodes;
  const nodesRes = [];

  if (nodes.includes('dev_node_2')) {
    const details = {
      "tracing": "disabled",
      "stats": "disabled",
      "port": -1,
      "name": "HelloWorld",
      "context": "/HelloWorld",
      "resources": [{
        "methods": ["GET"],
        "url": "N/A"
      }],
      "version": "N/A",
      "url": "http://localhost:8290/HelloWorld"
    };
    nodesRes.push({
      "details": JSON.stringify(details),
      "nodeId": "dev_node_2"
    });
  }

  if (nodesRes.length === 0) {
    res.send('{"count":0,"resourceList":[]}');
  } else {
    const json = {
      "count": nodesRes.length,
      "resourceList": [{
        "name": "HelloWorld",
        "nameIgnoreCase": "helloworld",
        "nodes": nodesRes
      }]
    };
    res.send(json);
  }
});

// services - { "count": 1, "list": [ { "name": "service_1", "basePath": "/hello" } ] }
// service details - { "package": "testOrg/artifacts_tests:1", "listeners": [ { "name": "listener_1", "protocol": "HTTP", "port": "8290" } ], "resources": [ { "methods": [ "GET" ], "url": "/greeting" } ] }
app.get('/dashboard/api/groups/:group/services', (req, res) => {
  const nodes = req.query.nodes;
  const nodesRes = [];
  if (nodes.includes('dev_node_4')) {
    const detailsNode4 = {
      "name": "service_1",
      "package": "testOrg/artifacts_tests:1",
      "basePath": "/hello",
      "listeners": [{
        "name": "listener_1",
        "protocol": "HTTP",
        "port": "8290"
      }],
      "resources": [{
        "methods": ["GET", "HEAD"],
        "url": "/greeting"
      },{
        "methods": ["POST"],
        "url": "/greeting"
      }]
    };
    nodesRes.push({
      "details": JSON.stringify(detailsNode4),
      "nodeId": "dev_node_4"
    });
  }
  if (nodesRes.length === 0) {
    res.send('{"count":0,"resourceList":[]}');
  } else {
    const json = {
      "count": nodesRes.length,
      "resourceList": [{
        "name": "service_1",
        "nodes": nodesRes
      }]
    };
    res.send(json);
  }
});

// listeners - { "count": 1, "list": [ { "name": "listener_1", "protocol": "HTTP", "port": "8290" } ] }
// listener details - { "package": "testOrg/artifacts_tests:1", "httpVersion": "1.1", "host": "localhost", "timeout": "30000", "requestsLimit": { "maxUriLength": "32768", "maxHeaderSize": "8192", "maxEntityBodySize": "5242880" } }
app.get('/dashboard/api/groups/:group/listeners', (req, res) => {
  var details = {
    "name": "listener_1",
    "protocol": "HTTP",
    "port": "8290",
    "package": "testOrg/artifacts_tests:1",
    "httpVersion": "1.1",
    "host": "localhost",
    "timeout": "30000",
    "requestsLimit": {
      "maxURILength": 32768,
      "maxHeaderSize": 8192,
      "maxEntityBodySize": 5242880
    }
  };
  var json = {
    "count": 1,
    "resourceList": [{
      "name": "listener_1",
      "nodes": [{
        "details": JSON.stringify(details),
        "nodeId": "dev_node_4"
      }]
    }]
  };
  res.send(json);
});



// app.use('/', express.static('../web-app/build'));
app.use('/', proxy('127.0.0.1:3000'));


app.listen(3001, () => console.log('Example app is listening on port 3001.'));
