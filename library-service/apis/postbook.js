"use strict";

const uuid = require('uuid');
const doc = require('dynamodb-doc');
const dynamoDb = new doc.DynamoDB();

module.exports.newbook = (event, context, callback) => {
    const errr = (error, data) => callback(null, {
        statusCode: error ? 400 : 200,
        headers: {
            "x-custom-header" : "custom header value"
        },
        body: error ? error.message : JSON.stringify(data)
    });

    const body = JSON.parse(event.body);

    if (body.type === undefined || body.type === null || typeof body.type !== 'string') {
        return errr(new Error('type not specified or invalid.'));
    }
    if (body.title === undefined || body.title === null || typeof body.title !== 'string') {
        return errr(new Error('title not specified or invalid.'));
    }
    if (body.author === undefined || body.author === null || typeof body.author !== 'string') {
        return errr(new Error('author not specified or invalid.'));
    }

    var newbook = {
        itemId: uuid.v1(),
        title: body.title,
        author: body.author
    };

    switch (body.type) {
        case 'book':
            if (body.publishDate === undefined || body.publishDate === null || typeof body.publishDate !== 'string') {
                return errr(new Error('publishDate not specified or invalid.'));
            }
            newItem.publishDate = body.publishDate;
            break;
        case 'video':
            if (body.videoLength === undefined || body.videoLength === null || typeof body.videoLength !== 'number') {
                return errr(new Error('length not specified or invalid.'));
            }
            newItem.videoLength = body.videoLength;
            break;
        default:
            return errr(new Error('type specified not supported.'));
    }

    const createParams = {
        TableName: process.env.TABLE_NAME,
        Item: newbook,
        ReturnValues: "ALL_OLD"
    };

    dynamoDb.putItem(createParams, (err, res) => {
        if (err) {
            errr(err);
        } else {
            errr(null, { message: "New item added!" });
        }
    });
};