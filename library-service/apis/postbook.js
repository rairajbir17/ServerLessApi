'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.newbook = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const name = requestBody.bookname;
  const genre = requestBody.genre;
  const author = requestBody.author;

  if (typeof name !== 'string' || typeof genre !== 'string' || typeof author !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit book because of validation errors.'));
    return;
  }

  submitCandidateP(candidateInfo(name, genre, author))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted candidate with genre ${genre}`,
          candidateId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit candidate with genre ${genre}`
        })
      })
    });
};


const submitCandidateP = candidate => {
  console.log('Submitting candidate');
  const candidateInfo = {
    TableName: process.env.BOOK_TABLE,
    Item: candidate,
  };
  return dynamoDb.put(candidateInfo).promise()
    .then(res => candidate);
};

const candidateInfo = (name, genre, author) => {
  const timestamp = new Date().getTime();
  return {
    book_id: uuid.v1(),
    name: name,
    genre: genre,
    author: author,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};