import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';
import { S3EventSource } from '@aws-cdk/aws-lambda-event-sources';

export class ThumbnailGeneratorStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
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
    const thumbnailFunction = new lambda.Function(this, 'ThumbnailFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'), // Assuming your Lambda code is in a 'lambda' directory
      environment: {
        THUMBNAILS_BUCKET_NAME: thumbnailsBucket.bucketName,
        DESTINATION_BUCKET_NAME: thumbnailsBucket.bucketName

      }
    });

    // Grant necessary permissions
    sourceBucket.grantRead(thumbnailFunction);
    thumbnailsBucket.grantReadWrite(thumbnailFunction); 

    // Configure Lambda function to be triggered by S3 events
    thumbnailFunction.addEventSource(new S3EventSource(sourceBucket, {
      events: [s3.EventType.OBJECT_CREATED]
    }));
  }
}
