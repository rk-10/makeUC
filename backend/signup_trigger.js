const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();


const DEFAULT_PARTNER_ID = "a98443fd-1318-4419-b647-4215778e68b8";


exports.handler = async (event, context, callback) => {

    // Send post authentication data to Cloudwatch logs
    console.log ("User ID = ", event);
    console.log ("User ID = ", context);
    const requestBody = event.request.userAttributes;
    const parameters = {
     id: requestBody.sub,
     email: requestBody.email,
     lastName: requestBody.family_name,
     updatedAt: (new Date(Date.now())).toDateString(),
     createdAt: (new Date(Date.now())).toDateString(),
     //partnerUserId: "Null",
     partnerUserId: DEFAULT_PARTNER_ID,
     firstName: requestBody.name
    }
    
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp'){
        const params = {
            TableName: 'User',
            Item: parameters
        }
        try {
            await dynamo.put(params).promise();
        } catch (err) {
            callback(err, event);
        }
    }
    // Return to Amazon Cognito
    callback(null, event);
};