'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
    const errr = (error, data) => callback(null, {
        statusCode: error ? 400 : 200,
        headers: {
            'x-custom-header' : 'custom header value'
        },
        body: error ? error.message : JSON.stringify(data)
    });

    const body = JSON.parse(event.body); 
    const book_name = body.name;
    const genre=body.genre;
    const author=body.author;
    if (typeof book_name !== 'string') {
        return errr(new Error('Book Name not specified or invalid.'));
    }

    if ( typeof genre !== 'string') {
        return errr(new Error('Genre not specified or invalid.'));
    }
    if (typeof author !== 'string') {
        return errr(new Error('author not specified or invalid.'));
    }

    var updateParameters = {
        TableName: process.env.BOOK_TABLE,
        Key: {
            book_id: event.pathParameters.id
        },    
    UpdateExpression: "set name=:name, genre=:genre, author=:author",
    ReturnValues:"ALL_NEW"
    };
   
   updateParameters.ExpressionAttributeValues= {
      ":name": book_name,
      ":genre": genre,
      ":author": author
    };

    dynamoDb.updateItem(updateParameters, (err, data) => {
        if (err) {
            console.error(err);
            callback(new Error('Couldn\'t update item.'));
            return;
        } else {
                console.log("Successfully Updated", JSON.stringify(data, null, 2));
                const response = {
                statusCode: 200,
                body: JSON.stringify("Book Successfully Updated", data),
                };
           callback(null, response);
        }
    });
};