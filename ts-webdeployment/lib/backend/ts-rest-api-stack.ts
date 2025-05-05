import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { AttributeType, Billing, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TsRestApiStack extends cdk.Stack {
  public readonly apiUrl: string;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const employeesTable = new TableV2(this, 'TS-EmplTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billing: Billing.onDemand()     
    });
  

    
    const emplLambda = new NodejsFunction(this, 'Ts-EmplLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: (join(__dirname, '../..', 'services', 'handler.ts')),
      environment: {
        TABLE_NAME: employeesTable.tableName
      },
    })

    employeesTable.grantReadWriteData(emplLambda);


    const api = new RestApi(this, 'TS-EmplApi')
    this.apiUrl = api.url;
    const empleResource = api.root.addResource('empl')

    const emplLambdaIntegration = new LambdaIntegration(emplLambda)

    empleResource.addMethod('GET', emplLambdaIntegration)
    empleResource.addMethod('POST', emplLambdaIntegration)


    new cdk.CfnOutput(this, 'ApiUrlOutput', {
      value: this.apiUrl,
      exportName: 'ApiUrlExport',
    });
    
  }
}
