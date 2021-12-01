const AWS = require("aws-sdk");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const dynamo = new AWS.DynamoDB.DocumentClient();
const secretKey = "0b40438a-7aa6-4c7b-a2d5-433564fe3e25ff1fe513-a8c7-43bf-b0fd-5bad57652003ef7fba7a-f130-437d-858e-262954f7cd05";

function verifyToken(event) {
  var token = event.headers['Authorization'].replace("Bearer ", "");
  return jwt.verify(token, secretKey);
}
function omit(obj, key) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}

exports.handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
    "X-Requested-With": "*"
  };

var users = [
    {
        "firstName": "test",
        "lastName": "test",
        "username": "test",
        "hash": "$2a$10$8oMyRguCb6ib.SMpSJxzouyYR3mEEpWiv0oUqfQmKeqEwWC4LOnFa",
        "id": 1,
        "dateCreated": "2021-11-08T20:19:12.293Z",
        "dateUpdated": "2021-11-08T20:19:12.293Z"
    },
    {
        "firstName": "admin",
        "lastName": "admin",
        "username": "admin",
        "hash": "$2a$10$A.mGgiSr9/uidSI7d3QOAuEQvVGgw0Ry7RRfTe.W1Ms.mlC/5v8iq",
        "id": 2,
        "dateCreated": "2021-11-09T15:14:22.056Z",
        "dateUpdated": "2021-11-09T15:14:22.056Z"
    }
];

  try {
    var token;
    var route;
    // works from HTTP API
    if ('routeKey' in event) {
      route = event.routeKey;
    } 
    // Works from REST API
    else {
      var method = event.httpMethod;
      var path = event.resource;
      route = method + " " + path;
    }
    
    let requestJSON;
    var currentDate = new Date().toISOString().split('T')[0];
    
    switch (route) {

      // Get all users
      case "GET /users":
        // for test, get users from json
        // body = users;
        
        verifyToken(event);

        var users = await dynamo.scan({ 
          TableName: "Rolex-url", 
          FilterExpression: "attribute_exists(username)" // we don't want the domains
        }).promise();

        // don't send the "hash" attribute
        body = users.Items.map((x) => omit(x, 'hash'));; 
        break;
        
      // Get 1 user
      case "GET /users/{id}":
        // for test, get user from json
        // body = Object.values(users).find(user => user.id === parseInt(event.pathParameters.id));
        verifyToken(event);
        var results = await dynamo
          .get({
            TableName: "Rolex-url",
            Key: {
              uuid: event.pathParameters.id
            }
          })
          .promise();
          body = omit(results.Item, 'hash');
        break;
        
      // Login a user
      case "POST /users/login":
        requestJSON = JSON.parse(event.body);
        const {username, password} = requestJSON;
        // for test, get user from json
        // const user = users.find((u) => u.username === username);
      
        var results = await dynamo.scan({
            TableName: "Rolex-url",
            FilterExpression : 'username = :u',
            ExpressionAttributeValues : {':u' : username}
        }).promise();

        var user = results.Items[0];
        // validate
        if (!user || !user.hash || !bcrypt.compareSync(password, user.hash)) {
          console.log("user", user);
          console.log("password hashing", bcrypt.compareSync(password, user.hash));
          throw 'Username or password is incorrect';
        }
      
        // create a jwt token that is valid for 7 days
        token = jwt.sign({sub: user.id}, secretKey, {expiresIn: '7d'});

        headers['Access-Control-Allow-Credentials'] = 'true';
        
        body = {
          uuid: user.uuid,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          token,
        };
        break;

      // Create a user
      case "PUT /users":
        verifyToken(event);
        requestJSON = JSON.parse(event.body);

        //TODO: check if username already exists

        await dynamo
          .put({
            TableName: "Rolex-url",
            Item: {
              uuid: requestJSON.uuid,
              firstName: requestJSON.firstName,
              lastName: requestJSON.lastName,
              username: requestJSON.username,
              hash: bcrypt.hashSync(requestJSON.password, 10),
              created: currentDate,
              updated: currentDate
            }
          })
          .promise();
        body = `Put user ${requestJSON.uuid}`;
        break;     
          
      // Delete a user 
      case "DELETE /users/{id}":
        verifyToken(event);
        await dynamo
          .delete({
            TableName: "Rolex-url",
            Key: {
              uuid: event.pathParameters.id
            }
          })
          .promise();
        body = `Deleted users ${event.pathParameters.id}`;
        break;
      
      // Update a user
      case "PUT /users/{id}":
        verifyToken(event);
        requestJSON = JSON.parse(event.body);

        // only update hashed password if entered
        if (requestJSON.password) {
          requestJSON.hash = bcrypt.hashSync(requestJSON.password, 10);
        }

        //TODO: test if user exists

        await dynamo
          .update({
            TableName: "Rolex-url",
            Key: {
              uuid: event.pathParameters.id
            },
            ExpressionAttributeNames:{
                "#hash": "hash" // domain is a reserved word in dynamodb - we must replace it before doing the update. Although it works fine for the creation ...
            },
            UpdateExpression: "set firstName=:f, lastName=:l, username=:u, #hash=:h, updated=:up",
            ExpressionAttributeValues:{
              ":f": requestJSON.firstName,
              ":l": requestJSON.lastName,
              ":u": requestJSON.username,
              ":h": requestJSON.hash,
              ":up": currentDate
            },
            ReturnValues:"UPDATED_NEW"
          })
          .promise();
        body = `Put user ${event.pathParameters.id}`;
        break;   

        // Delete a domain
        case "DELETE /domains/{id}":
          // verifyToken(event);
          await dynamo
            .delete({
              TableName: "Rolex-url",
              Key: {
                uuid: event.pathParameters.id
              }
            })
            .promise();
          body = `Deleted domain ${event.pathParameters.id}`;
          break;

        // Get one domain
        case "GET /domains/{id}":
          body = await dynamo
            .get({
              TableName: "Rolex-url",
              Key: {
                uuid: event.pathParameters.id
              }
            })
            .promise();
          break;

        // Get all domain
        case "GET /domains":
          body = await dynamo.scan({ 
            TableName: "Rolex-url", 
            FilterExpression: "attribute_exists(brand)" // we don't want the users
          }).promise();
          break;

        // Create a new domain
        case "PUT /domains":
          // verifyToken(event);
          requestJSON = JSON.parse(event.body);
          await dynamo
            .put({
              TableName: "Rolex-url",
              Item: {
                uuid: requestJSON.uuid,
                domain: requestJSON.domain,
                brand: requestJSON.brand,
                environment: requestJSON.environment,
                live: requestJSON.live,
                liveCN: requestJSON.liveCN,
                comment: requestJSON.comment,
                expectedRedirectEU: requestJSON.expectedRedirectEU,
                expectedRedirectCN: requestJSON.expectedRedirectCN,
                changesTodo: requestJSON.changesTodo,
                updated: currentDate
              }
            })
            .promise();
          body = `Put domain ${requestJSON.uuid}`;
          break;
        
        // Update a domain
        case "PUT /domains/{id}":
          // verifyToken(event);
          requestJSON = JSON.parse(event.body);
          await dynamo
            .update({
              TableName: "Rolex-url",
              Key: {
                uuid: event.pathParameters.id
              },
              ExpressionAttributeNames:{
                  "#com": "comment",
                  "#dom": "domain" // domain is a reserved word in dynamodb - we must replace it before doing the update. Although it works fine for the creation ...
              },
              UpdateExpression: "set #dom = :d, brand=:b, environment=:e, live=:l, liveCN=:lcn, #com=:c, expectedRedirectEU=:reqeu, expectedRedirectCN=:reqcn, changesTodo=:todo, updated=:u",
              ExpressionAttributeValues:{
                ":d": requestJSON.domain,
                ":b": requestJSON.brand,
                ":e": requestJSON.environment,
                ":l": requestJSON.live,
                ":lcn": requestJSON.liveCN,
                ":c": requestJSON.comment,
                ":reqeu": requestJSON.expectedRedirectEU,
                ":reqcn": requestJSON.expectedRedirectCN,
                ":todo": requestJSON.changesTodo,
                ":u": currentDate
              },
                ReturnValues:"UPDATED_NEW"
            })
            .promise();
          body = `Put domain ${event.pathParameters.id}`;
          break;
      
      default:
        throw new Error(`Unsupported route: "${route}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;//+ " "+ JSON.stringify(event);
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers
  };
};