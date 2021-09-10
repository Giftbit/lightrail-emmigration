import * as aws from "aws-sdk";

export const dynamodb = new aws.DynamoDB({
    apiVersion: "2012-08-10",
    region: process.env["AWS_REGION"] ?? "us-west-2",
});
