const AWS = require('aws-sdk')
let util = require('util');

AWS.config.update({region: 'us-east-1'})

// Create the DynamoDB service object
let dynamodb = new AWS.DynamoDB.DocumentClient();


// query dynamo
async function getRecords(user, domain){
  var params = {
    TableName : "primary",
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
    ExpressionAttributeNames:{
      "#pk": "pk",
      "#sk": 'sk'
    },
    ExpressionAttributeValues: {
      ":pk": `ORG#${domain}`,
      ":sk": user
    }
  }
  
  
  console.log('getQuery Params => ', params);
  let dynamoDb = util.promisify(dynamodb.query).bind(dynamodb);
  let results = await dynamoDb(params);
  console.log('results => ', results);
  return results
}






// main handler
exports.handler = async function (event) {
  
  try {
    const {email} = event.queryStringParameters
    const [user, domain] = email.split('@')
    
    if (user === email || !(user && email)){
      throw 'invalid email'
    }
    
    const records = await getRecords(user, domain)
    const results = records.Items.map(item => item.sk.split('#')[1])
    return sendRes(200, {'results':results})
  }
  
  catch (e){
    return sendRes(200, {'error':e})
  }
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
      body: JSON.stringify(body),
    }
    
    return response
}