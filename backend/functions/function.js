const AWS = require('aws-sdk')

AWS.config.update({region: 'us-east-1'})

// Create the DynamoDB service object
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});



const record = (X) => {
    return {
        PutRequest: {
            Item: {
                'pk' : {S: X[0]},
                'sk' : {S: X[1]}
            }
        }
    }
}



function buildRecordSet(path, url, email){
    // get important data points
    
    const [user, domain] = email.split('@')
    
    const A = [`DOMAIN#${domain}`,user]
    const B = [`URL#${url}`, email]
    const C = [email, `PATH#${path}`]
    
    return [record(A), record(B), record(C)]
}







// save to dynamo
async function saveData(records){
    console.log('records',records)
    let response
    try{
        response = await dynamodb.batchWriteItem(
            {
                RequestItems: { Hello: records }
            }
        ).promise()
    }
    
    catch(err){response=err}
    return response
}





async function buildRecords(path, emails){
    console.log('SAVING EMAILS:', emails)
    
    
    
    const url = path.split('/').slice(0,3).join('/')
    
    let records = []
    
    emails.map(
        email => {
            const recordSet = buildRecordSet(path,url,email)
            records = records.concat(recordSet)
        }
    )
    
    console.log(records)
    
    const response = await saveData(records)
    
    console.log('RESPONSE', response)
    return response
}






// main handler
exports.handler = async function (event) {
    const {path, emails} = JSON.parse(event.body)
    await buildRecords(path, emails)
    return sendRes(200, event.body)
}
  
  






// format response
const sendRes = (status, body) => {
    var response = {
      statusCode: status,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        "Content-Type": "text/html"
      },
      body: body,
    }
    
    return response
}