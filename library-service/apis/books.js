'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.bookslist = (event, context, callback) => {
    var params = {
        TableName: process.env.BOOK_TABLE,
        ProjectionExpression: "book_id, author, genre"
    };

    console.log("Scanning Candidate table.");
    const onScan = (err, data) => {

        if (err) {
            console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            console.log("Scan succeeded.");
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    candidates: data.Items
                })
            });
        }

    };

    dynamoDb.scan(params, onScan);

};