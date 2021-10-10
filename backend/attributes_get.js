const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const dynamo = new AWS.DynamoDB.DocumentClient();

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
    //console.log('Received event:', JSON.stringify(event, null, 2));
    

    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        const decodedJwt = jwt.decode(event.headers.Authorization, {complete: true});
        // console.log(decodedJwt)
        // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
        // console.log("decoded id: ", decodedJwt.payload.sub)
        const params=  {
            TableName:'Journal',
            // ProjectionExpression:'name', // remove this string if you want to get not only 'name'
            FilterExpression:'userId = :userId',
            ExpressionAttributeValues:{ ":userId" : decodedJwt.payload.sub }
        };
        console.log("EVENT: ", event)
        console.log("CONTEXT: ", context)
        // body = await dynamo.scan({ TableName: event.queryStringParameters.TableName }).promise();
        body = await dynamo.scan(params).promise();
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

