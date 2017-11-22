'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.deletebook = (event, context, callback) => {
  const params = {
    TableName: process.env.BOOK_TABLE,
    Key: {
      book_id: event.pathParameters.id,
    },
  };

  dynamoDb.deleteItem(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify("Item deleted"),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch candidate.'));
      return;
    });
};







// module.exports.deletebook = (event, context, callback) => {
//     const errr = (error, data) => callback(null, {
//         statusCode: error ? 400 : 200,
//         headers: {
//             'x-custom-header' : 'custom header value'
//         },
//         body: error ? error.message : JSON.stringify(data)
//     });

//     const path = event.pathParameters;

//     if ( typeof path.id !== 'string') {
//         return errr(new Error('Id in path not specified or invalid.'));
//     }

//     const deleteParameters = {
//         TableName: process.env.BOOK_TABLE,
//         Key: {
//             "book_id": event.pathParameters.id,
//         }
//     };

//     dynamoDb.deleteItem(deleteParameters, (err, res) => {
//         if (err) {
//             errr(err);
//         } else {
//             callback(null, { message: "Book Successfully deleted" });
//         }
//     })
// };