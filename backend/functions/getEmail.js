const AWS = require('aws-sdk')

AWS.config.update({region: 'us-east-1'})

// Create the DynamoDB service object
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'})


// main handler
exports.handler = async function (event) {
    return sendRes(200, JSON.stringify({'ok':'it works'}))
}


// format response
const sendRes = (status, body) => {
    var response = {
      statusCode: status,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Content-Type": "json/application"
      },
      body: body,
    }
    
    return response
}