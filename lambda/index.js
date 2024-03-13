const AWS = require('aws-sdk');
const sharp = require('sharp');

exports.handler = async (event) => {
  const s3 = new AWS.S3();
  const thumbnailsBucketName = process.env.THUMBNAILS_BUCKET_NAME;

  for (const record of event.Records) {
    const sourceBucketName = record.s3.bucket.name;
    const sourceKey = record.s3.object.key;

    // Generate thumbnail
    const thumbnailKey = sourceKey.replace(/\.(jpeg|jpg|png)$/i, '_thumb.jpg');
    const thumbnailObject = await sharp(record.s3.object.key)
      .resize({ width: 100 })
      .toBuffer();

    // Upload thumbnail to thumbnails bucket
    await s3.putObject({
      Bucket: thumbnailsBucketName,
      Key: thumbnailKey,
      Body: thumbnailObject
    }).promise();
  }
};
