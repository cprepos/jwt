var expect = require('chai').expect,
    request = require('request');

describe('Test server', function () {
    //for testing pre authed client validation
    var token = '';

    it('should connect to api with proper credentials', function (done) {
        request({
            url: 'https://localhost:8443/auth',
            strictSSL: false,
            method: 'POST',
            form: { user: "Christopher", pass: "ChristopherIsBest" }
        }, function (err, response, body) {
            var bodyObj = JSON.parse(body);
            //Check for JWT
            expect(bodyObj.token.search(/^.+?\..+?\..+?$/)).to.be.above(-1);
            //Pass JWT for testing
            token = bodyObj.token;

            done();
        })
    })
    it('should not connect to api with bogus credentials', function (done) {
        request({
            url: 'https://localhost:8443/auth',
            strictSSL: false,
            method: 'POST',
            form: { user: "Christopher", pass: "BOGUSChristopherIsBest" }
        }, function (err, response, body) {
            expect(body).to.not.equal('success');
            done();
        })
    })
    it('should connect to secret endpoint', function (done) {
        request({
            url: 'https://localhost:8443/supersecrettestendpoint',
            strictSSL: false,//self signed
            method: 'get',
            headers: {
                "Authorization": token
            },
            form: { user: "Christopher", pass: "ChristopherIsBest" }
        }, function (err, response, body) {
            var bodyObj = JSON.parse(body);
            expect(bodyObj.token.search(/^.+?\..+?\..+?$/)).to.be.above(-1);
            done();
        })
    })
    it('should NOT connect to secret endpoint because bad token.', function (done) {
        request({
            url: 'https://localhost:8443/supersecrettestendpoint',
            strictSSL: false,//self signed
            method: 'get',
            headers: {
                "Authorization": token.replace(/..../, 'AAAA')
            },
            form: { user: "Christopher", pass: "ChristopherIsBest" }
        }, function (err, response, body) {
            var bodyObj = JSON.parse(body);
            expect(bodyObj.error.search(/Could not decode token./)).to.be.above(-1);
            done();
        })
    })
})

