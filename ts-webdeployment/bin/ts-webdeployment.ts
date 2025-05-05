#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TsWebdeploymentStack } from '../lib/frontend/ts-webdeployment-stack';
import { TsRestApiStack } from '../lib/backend/ts-rest-api-stack';

const app = new cdk.App();

const backendStack = new TsRestApiStack(app, 'TsRestApiStack');

new TsWebdeploymentStack(app, 'TsWebdeploymentStack', {
  apiUrl: backendStack.apiUrl,
});