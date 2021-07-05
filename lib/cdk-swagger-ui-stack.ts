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
    const filePath = path + "index.html"
    // Do replacement in file
    fs.readFile(filePath, 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }

      // Actual thing i want to do
      // const result = data.replace(/https:\/\/.\+.json/, 'my.json');

      // For testing with no changes
      const result = data

      fs.writeFile(filePath, result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });

    new S3Deployment.BucketDeployment(this, 'Deployment', {
      sources: [S3Deployment.Source.asset(path)],
      destinationBucket: bucket,
    });

    new cdk.CfnOutput(this, 'BucketDomain', {
      value: bucket.bucketWebsiteDomainName,
    });
  }
}
