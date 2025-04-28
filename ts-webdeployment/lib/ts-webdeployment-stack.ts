import * as cdk from 'aws-cdk-lib';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { existsSync } from 'fs';
import { join } from 'path';

export class TsWebdeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //S3 Construct new Bucket for storage web
    const deploymentBucket = new Bucket(this, 'TsWebDeploymentBucket')

    //Find the project folder 
    const uiDir = join(__dirname, '..','..', 'web', 'dist');
    if (!existsSync(uiDir)) {
      console.warn('Ui dir not found: ' + uiDir);
      return;
    }

    //CLOUDFRONT Construct new Origin access identity
    const originIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    deploymentBucket.grantRead(originIdentity);
    
    //Here CloudFront take the website and distribuite in all network, or to client
    const distribution = new Distribution(this, 'WebDeploymentDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity
        }),
      },      
    });
    //After Bucket and CloudFront distribution instances are created, Im going to 
    //Deploy my website inside of Bucket with the configured distribution from Cloudfront
    new BucketDeployment(this, 'WebDeployment', {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
      distribution: distribution
    });

    new cdk.CfnOutput(this, 'TsAppUrl', {
      value: distribution.distributionDomainName
    })

  }
}