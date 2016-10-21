//Load aws node package
var AWS = require('aws-sdk');
var AWS.config.loadFromPath('./assets/AWSSecret.json');
//Get dynamodb up and running
var $db = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8000') }),
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
