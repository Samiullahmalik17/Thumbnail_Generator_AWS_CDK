import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { App, Stack } from 'aws-cdk-lib';               
import { aws_s3 as s3 } from 'aws-cdk-lib';     
import * as codestar from '@aws-cdk/aws-codestar-alpha'; 
import { aws_lambda } from 'aws-cdk-lib';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
// import * as eventsources from 'aws-cdk-lib/aws-lambda-event-sources';


export class ThumbnailGeneratorStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create source bucket
    const sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY // Change to RETAIN if you want to keep the bucket when stack is deleted
    });

    // Create destination bucket for thumbnails
    const thumbnailsBucket = new s3.Bucket(this, 'ThumbnailsBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY // Change to RETAIN if you want to keep the bucket when stack is deleted
    });

    // Create Lambda function to generate thumbnails
    const thumbnailFunction = new aws_lambda.Function(this, 'ThumbnailFunction', {
      runtime: aws_lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: aws_lambda.Code.fromAsset('lambda'), // Assuming your aws_lambda code is in a 'lambda' directory
      environment: {
        THUMBNAILS_BUCKET_NAME: thumbnailsBucket.bucketName,
        DESTINATION_BUCKET_NAME: thumbnailsBucket.bucketName

      }
    });

    // Grant necessary permissions
    sourceBucket.grantRead(thumbnailFunction);
    thumbnailsBucket.grantReadWrite(thumbnailFunction); 

    // Configure aws_lambda function to be triggered by S3 events
    thumbnailFunction.addEventSource(new S3EventSource(sourceBucket, {
      events: [s3.EventType.OBJECT_CREATED]
    }));
  }
}
