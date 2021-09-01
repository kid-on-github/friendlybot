import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as apigw from "@aws-cdk/aws-apigateway";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Dynamodb table definition
    const table = new dynamodb.Table(this, "primary", {
      tableName:'primary',
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });


    // lambda function - post email api
    const postEmailLambda = new lambda.Function(this, "postEmailLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("functions"),
      handler: "postEmail.handler",
      environment: {
        PRIMARY_TABLE_NAME: table.tableName,
      },
    });


    // lambda function - get email api
    const getEmailLambda = new lambda.Function(this, "getEmailLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("functions"),
      handler: "getEmail.handler",
      environment: {
        PRIMARY_TABLE_NAME: table.tableName,
      },
    });


    // access permissions (lambda to dynamo)
    table.grantWriteData(postEmailLambda);
    table.grantReadData(getEmailLambda);


    // api
    const api = new apigw.RestApi(this, "api", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigw.Cors.ALL_ORIGINS
      }
    });


    // post-email
    api.root
      .resourceForPath("post-email")
      .addMethod("POST", new apigw.LambdaIntegration(postEmailLambda));


    // get-email
    api.root
      .resourceForPath("get-email")
      .addMethod("GET", new apigw.LambdaIntegration(getEmailLambda));
  
    


    new cdk.CfnOutput(this, "HTTP API URL", {
      value: api.url ?? "Something went wrong with the deploy",
    });
    
       
  }
}
