var jwt = require('./jwt.js'),
dynamo = require('./aws.js'),
//redis mem storage
redis = require('redis'),
client = redis.createClient(6379, 'localhost', { enable_offline_queue: false });

//redis rate limiter. Tthis package because it also has the ability to spread the requests
//so that users can't do 100 consecutive requests in 10 seconds. It will allow one per 0.6 seconds instead.
//For now I have it set to a simple 100/minute at any rate.

var rateLimiter = require('redis-rate-limiter');
var limit = rateLimiter.create({
    redis: client,
    key: 'ip',
    value: (Date.now() / 1000),
    rate: '100/minute'
});


//Init main object to export
var Handlers = {};



//Get Sources in Table Form
Handlers.auth = function () {
    return function (req, res) {
        limit(req, function (err, rate) {
            //set response headers
            res.header("Content-Type", "text/json");
            //make absolutely sure POST
            if (req.method === 'POST' && !rate.over) {
                //Get credentials from dynamo
                dynamo.getCredentials(req.body, function (err, credentials) {
                    //make sure user and password exist in DB
                    if (JSON.stringify(credentials) === JSON.stringify(req.body)) {
                        var token = jwt.getToken(req);
                        jwt.success(res, token, "success");
                    }
                    else {
                        jwt.authFail(res, 'error, cannot autheticate credentials.');
                    }
                });//dynamo get
            }//if POST and rate over
            else {
                res.end('Rate limit reached for ' + req.method);
            }
        });//limiter
    }//return
}//auth
Handlers.validate = function () {
    return function (req, res) {
        //set headers
        res.header("Content-Type", "text/html");
        //make absolutely sure POST
        if (req.method === 'GET') {
            //Get credentials from dynamo
            jwt.validate(req, res, function (err, valid) {
                //make sure user and password exist in DB
                if (valid) {
                    jwt.success(res, token);
                }
                else {
                    jwt.authFail(res, 'Could not auth token.');
                }
            });//jwt validate
        }//if
    }//return
}//validate
module.exports = Handlers;
