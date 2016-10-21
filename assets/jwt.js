var dynamo = require('./aws.js');
var jwt = require('jsonwebtoken');
var getIp = require('ipware')().get_ip;
var md5 = require('md5');
var JWTsecret = require('./JWTsecret.js');
var _ = require('lodash');
//if we want RS256. Async also works on this apparently
//Needs good certs
/*var fs = require('fs');
var cert = fs.readFileSync('key.pem');
methods.sign = function () {
    return jwt.sign(credentials, cert, { algorithm: 'RS256'});
}*/

var methods = {};
//Success/fail methods


methods.authFail = function (res, message, callback) {
  //Log. Schema {error:message, ip:}
  if (typeof message === 'undefined') {
    message = "Error, cannot auth."
  }
  res.end(JSON.stringify({error:message}));
  //if needed
  if (typeof callback === "function")
    return callback(res);
}
methods.success = function (res, token, message) {
//send back token as per spec
  res.send(JSON.stringify({token:token}));
  //Juuuust incase I want later
  if (typeof callback === "function")
    return callback(res);
}
//generate token
methods.getToken = function generateAndStoreToken(req, opts) {
  var UID = getUID();
  var token = generateToken(req, UID, opts);
  var record = {
    "valid": true,
    "created": new Date().getTime(),
    "ip": getIp(req)
  };
  //Deposit UID
  dynamo.putUID({
    uid: UID,
    log: JSON.stringify(record)
  }, function (err) {
  });
  return token;
}

methods.validate = function validate(req, res, callback) {
  var token = req.headers.authorization;
  //verify token
  verify(token, function (decoded) {

    if (!decoded || !decoded.auth) {
      methods.authFail(res, 'Could not decode token.')
      return callback(false);
    } else {
      
      dynamo.getUID(decoded.auth, function (err, record) {
        if (record.length == 0 || decoded.exp < (Date.now() / 1000)) {
          return callback(false);
        } else {
          methods.success(res, token, 'Speak friend, and enter. <br> FRIEND!');
          return callback(true);
        }
      });//db get
    }//else
  });//Verify
}//Validate


module.exports = methods;

//Background Cast
function verify(token, cb) {
  var decoded = false;
  //Verify attempt
  try {
    decoded = jwt.verify(token, JWTsecret);
  } catch (e) {
    decoded = false; // still false
  }
  //Check if callback for Async
  if (typeof cb === 'function') {
    return cb(decoded);
  }
  else {
    return decoded;
  }
}

function getUID() {
  return _.shuffle(md5(new Date().getTime()));
}
function generateToken(req, UID, opts) {
  opts = opts || {};
  // expire the token after 7 days.
  var expiresDefault = Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60;

  var token = jwt.sign({
    auth: UID,
    agent: req.headers['user-agent'],
    exp: opts.expires || expiresDefault
  }, JWTsecret);
  return token;
}


/*
//Logout function, not a part of current scope
methods.logout = function (req, res, callback) {
  // invalidate the token
  var token = req.headers.authorization;
  var decoded = verify(token, function (decoded) {
    if (decoded) { 
      // asynchronously read and invalidate
      dynamo.getUID(decoded.auth, function (err, record) {
        var updated = JSON.parse(record);
        updated.valid = false;
        dynamo.putUID(decoded.auth, updated, function (err) {
          res.writeHead(200, { 'content-type': 'text/plain' });
          res.end('Logged Out!');
          return callback(res);
        });//db put
      });//db get
    } else {
      methods.authFail(res);
      return callback(res);
    }
  });//verify
}*/