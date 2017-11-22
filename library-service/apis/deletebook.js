'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.deletebook = (event, context, callback) => {
  const params = {
    TableName: process.env.BOOK_TABLE,
    Key: {
      book_id: event.pathParameters.id,
    },
  };


    console.log("Deleting  item.");
    dynamoDb.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete book. Error JSON:", JSON.stringify(err, null, 2));
        callback(new Error('Couldn\'t delete book.'));
        return;
    } else {
        console.log("Successfully Deleted", JSON.stringify(data, null, 2));
        const response = {
        statusCode: 200,
        body: JSON.stringify("Book Successfully Deleted", data),
      };
      callback(null, response);

    }
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