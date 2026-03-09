const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
require('dotenv').config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
});

const uploadToS3 = async (file) => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `issues/${uuidv4()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    const result = await s3.upload(params).promise();
    return result.Location;
};

module.exports = { uploadToS3 };
