const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const dynamo = new AWS.DynamoDB.DocumentClient();
var uuid = require('uuid');


/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = async (event, context) => {
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const requestBody = JSON.parse(event.body);
        const decodedJwt = jwt.decode(event.headers.Authorization, {complete: true});
        const parameters = {
         id: uuid.v1(),
         userId: decodedJwt.payload.sub,
         email: decodedJwt.payload.email,
         emotion: requestBody.emotion,
         sleep: requestBody.sleep,
         text: requestBody.text,
         updatedAt: (new Date(Date.now())).toDateString(),
         createdAt: (new Date(Date.now())).toDateString()
        }
        console.log("EVENT: ", event)
        console.log("CONTEXT: ", context)
        
        const params = {
            TableName: 'Journal',
            Item: parameters
        };
        // console.log(event.body);
        // body = await dynamo.scan({ TableName: event.queryStringParameters.TableName }).promise();
        
        
            var qparams = {
                  TableName : 'Journal',
                  userId: parameters.userId,
                  id: parameters.id
            };
            
            dynamo.scan(qparams, function(err, qdata) {
                if (err) {
                    console.log('Queried for Existing journal:', err);
                }else{
                    console.log('Queried for Existing journal:', qdata);
                } 
                    
            });
        
        
        
        body = await dynamo.put(params).promise();
        
        
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

