import * as cdk from '@aws-cdk/core';
import * as S3 from "@aws-cdk/aws-s3";
import * as S3Deployment from "@aws-cdk/aws-s3-deployment";
import * as fs from "fs";

export class CdkSwaggerUiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const bucket = new S3.Bucket(this, "Files", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });

    const path = `./swagger-ui-${process.env.SWAGGER_UI_VERSION}/dist/`

    new S3Deployment.BucketDeployment(this, 'Deployment', {
      sources: [S3Deployment.Source.asset(path)],
      destinationBucket: bucket,
    });

    new cdk.CfnOutput(this, 'BucketDomain', {
      value: bucket.bucketWebsiteDomainName,
    });
  }
}
