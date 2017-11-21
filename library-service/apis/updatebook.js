'use strict';

const doc = require('dynamodb-doc');
const dynamoDb = new doc.DynamoDB();

module.exports.book = (event, context, callback) => {
    const errr = (error, data) => callback(null, {
        statusCode: error ? 400 : 200,
        headers: {
            'x-custom-header' : 'custom header value'
        },
        body: error ? error.message : JSON.stringify(data)
    });

    const path = event.pathParameters;
    const body = JSON.parse(event.body);
    if (path.itemType === undefined || path.itemType === null || typeof path.itemType !== 'string') {
        return errr(new Error('type in path not specified or invalid.'));
    }
    if (path.itemId === undefined || path.itemId === null || typeof path.itemId !== 'string') {
        return errr(new Error('id in path not specified or invalid.'));
    }

    if (body.title === undefined || body.title === null || typeof body.title !== 'string') {
        return errr(new Error('title not specified or invalid.'));
    }
    if (body.author === undefined || body.author === null || typeof body.author !== 'string') {
        return errr(new Error('author not specified or invalid.'));
    }

    var updateParams = {
        TableName: process.env.TABLE_NAME,
        Key: {
            "itemId": path.itemId
        },
        UpdateExpression: "set title=:p1, author=:p2",
        ReturnValues: "ALL_NEW"
    };

    switch (path.itemType) {
        case 'books':
            if (body.publishDate === undefined || body.publishDate === null || typeof body.publishDate !== 'string') {
                return errr(new Error('publishDate not specified or invalid.'));
            }
            updateParams.UpdateExpression += ", publishDate=:p3";
            updateParams.ExpressionAttributeValues = {
                ":p1": body.title,
                ":p2": body.author,
                ":p3": body.publishDate
            };
            break;
        default:
            return errr(new Error('type specified not supported (path).'));
    }

    dynamoDb.updateItem(updateParams, (err, data) => {
        if (err) {
            errr(err);
        } else {
            errr(null, { message: "Item updated!" });
        }
    })
};