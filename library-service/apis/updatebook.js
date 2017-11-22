'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
    const errr = (error, data) => callback(null, {
        statusCode: error ? 400 : 200,
        headers: {
            'x-custom-header' : 'custom header value'
        },
        body: error ? error.message : JSON.stringify(data)
    });

    const path = event.pathParameters;
    const body = JSON.parse(event.body);
    if ( typeof path.book_id !== 'string') {
        return errr(new Error('Id in path not specified or invalid.'));
    }
    if (typeof path.bookname !== 'string') {
        return errr(new Error('Book Name not specified or invalid.'));
    }

    if ( typeof body.genre !== 'string') {
        return errr(new Error('Genre not specified or invalid.'));
    }
    if (typeof body.author !== 'string') {
        return errr(new Error('author not specified or invalid.'));
    }

    var updateParameters = {
        TableName: process.env.TABLE_NAME,
        Key: {
            "book_id": path.id
        },
        UpdateExpression: "set name=:p1,bookgenre=:p2, bookauthor=:p3",
        ReturnValues: "ALL_NEW"
    };

 

    dynamoDb.updateItem(updateParameters, (err, data) => {
        if (err) {
            errr(err);
        } else {
            errr(null, { message: "Book Succesfullly updated" });
        }
    })
};