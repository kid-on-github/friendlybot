const AWS = require('aws-sdk')

AWS.config.update({region: 'us-east-1'})

// Create the DynamoDB service object
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});



// save to dynamo
async function saveData(A,B,C){
    const params = {
        RequestItems: {
            Hello: [
                {
                    PutRequest: {
                        Item: {
                            'pk' : {S: A[0]},
                            'sk' : {S: A[1]}
                        }
                    }
                },
                {
                    PutRequest: {
                        Item: {
                            'pk' : {S: B[0]},
                            'sk' : {S: B[1]}
                        }
                    }
                },
                {
                    PutRequest: {
                        Item: {
                            'pk' : {S: C[0]},
                            'sk' : {S: C[1]}
                        }
                    }
                }
            ]
            
        }
    }
    
    let response
    try{response = await dynamodb.batchWriteItem(params).promise()}
    catch(err){response=err}
    
    return response
}



// main handler
exports.handler = async function (event) {
    console.log("request:", JSON.stringify(event))
    
    console.log('SAVING DATA:')
    
    
    
    
    const domain = 'lemonshell.com'
    const email = 'mike@lemonshell.com'
    const url = 'https://lemonshell.com'
    const pat = url + '/contact'
    const user = 'mike'
    
    
    const response = await saveData(
        [`DOMAIN#${domain}`,user],
        [`URL#${url}`, email],
        [email, `PATH#${pat}`]
    )
    
    
    console.log('RESPONSE', response)
    console.log(event)

    let {path, emails} = event['queryStringParameters']

    return sendRes(200, "Hey" + path + emails)
};
  
  

// format response
const sendRes = (status, body) => {
    var response = {
      statusCode: status,
      headers: {"Content-Type": "text/html"},
      body: body,
    };
    return response;
};