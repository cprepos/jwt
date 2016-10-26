//Load aws node package
var AWS = require('aws-sdk');
//NOTE: For some reason linux requires that I assign key and secret this way. Not clean code, this is a workaround
//to an aws-sdk package bug. 
var AWSCredentials = require(__dirname+'/AWSSecret.js')
process.env.AWS_ACCESS_KEY_ID = AWSCredentials.accessKeyId;
process.env.AWS_SECRET_ACCESS_KEY = AWSCredentials.secretAccessKey;
process.env.AWS_REGION =  AWSCredentials.region;


//Get dynamodb up and running
var $db = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8001') }),
 DynamoDB = require('aws-dynamodb')($db);



// every call to Amazon DynamoDB that fail will
// call this function before the operation's callback
DynamoDB.on('error', function (operation, error, payload) {
    // log dynamo error stuff here
})
var modules = {};
//for user/pass
modules.getCredentials = function (credentials, cb) {
    DynamoDB
        .table('users')
        .where('user').eq(credentials.user)
        .where('pass').eq(credentials.pass)
        .get(function (err, data) {
            return cb(err, data);
        })
}
// for uid check
modules.getUID = function (uid, cb) {
    DynamoDB
        .table('uids')
        .where('uid').eq(uid)
        .query(function (err, data) {
            return cb(err, data);
        })
}
//for uid deposit
modules.putUID = function (auth, cb) {
    DynamoDB
        .table('uids')
        .where('uid').eq(auth.uid)
        .return(DynamoDB.UPDATED_OLD)
        .insert_or_update(auth, function (err, data) {
            cb(err, data)
        })
}
module.exports = modules;
