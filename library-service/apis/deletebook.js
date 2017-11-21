'use strict';

const doc = require('dynamodb-doc');
const dynamoDb = new doc.DynamoDB();

module.exports.item = (event, context, callback) => {
    const finishThis = (error, data) => callback(null, {
        statusCode: error ? 400 : 200,
        headers: {
            'x-custom-header' : 'custom header value'
        },
        body: error ? error.message : JSON.stringify(data)
    });

    const path = event.pathParameters;

    if (path.itemType === undefined || path.itemType === null || typeof path.itemType !== 'string') {
        return finishThis(new Error('type in path not specified or invalid.'));
    }
    if (path.itemId === undefined || path.itemId === null || typeof path.itemId !== 'string') {
        return finishThis(new Error('id in path not specified or invalid.'));
    }

    switch (path.itemType) {
        case 'books':
        case 'videos':
            break;
        default:
            return finishThis(new Error('type specified not supported (path).'));
    }
    const deleteParams = {
        TableName: process.env.TABLE_NAME,
        Key: {
            "itemId": path.itemId
        },
        ReturnValues: "ALL_OLD"
    };

    dynamoDb.deleteItem(deleteParams, (err, res) => {
        if (err) {
            finishThis(err);
        } else {
            finishThis(null, { message: "Item deleted!" });
        }
    })
};