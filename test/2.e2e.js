//End to end testing with nightmare is one of my strongest suits.
//I spent the better part of last year figuring out how to crack source websites
//security measures for OIQ (my last company)
require('mocha-generators').install();

var Nightmare = require('nightmare');

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

var settings = {
    url: 'https://localhost:8443',
    timeout: 50000
};

describe('Angular test', function () {
    var nightmare;

    this.timeout(settings.timeout);

    beforeEach(function* () {
        nightmare = Nightmare({
            show: true,
            switches: {
                'ignore-certificate-errors': true
            }
        }).goto(settings.url);
    });

    afterEach(function* () {
        yield nightmare.end();
    });

    it('The title should be "JWT Login"', function* () {
        var title = yield nightmare.title();
        expect(title).to.equal('JWT Login');
    });

    it('The submit button should be clickable and change the words', function* () {
        var before_click = yield nightmare
            .evaluate(function () {
                els = document.querySelectorAll('textarea');
                return Array.prototype.map.call(els, function (el) {
                    return el.value;
                });
            });
        var after_click = yield nightmare
            .click('#submit')
            .wait(1000)
            .evaluate(function () {
                els = document.querySelectorAll('textarea');
                return Array.prototype.map.call(els, function (el) {
                    return el.value;
                });
            });
        expect(before_click).to.not.deep.equal(after_click);
    });

    it('The user should be able to log in with correct credentials', function* () {
        var before_click = yield nightmare
            .type('body > form > input[ng-model=user]', 'Christopher')
            .type('body > form > input[ng-model=pass]', 'ChristopherIsBest')
            .evaluate(function () {
                els = document.querySelectorAll('textarea');
                return Array.prototype.map.call(els, function (el) {
                    return el.value;
                });
            });
        var after_click = yield nightmare
            .click('#submit')
            .wait(1000)
            .evaluate(function () {
                els = document.querySelectorAll('textarea');
                return Array.prototype.map.call(els, function (el) {
                    return el.value;
                });
            });
        expect(before_click).to.not.deep.equal(after_click);
        expect(JSON.stringify(after_click).search(/^.+?\..+?\..+?$/)).to.be.above(-1);
    });

    it('The user should NOT be able to log in with bogus credentials', function* () {
        var before_click = yield nightmare
            .type('body > form > input[ng-model=user]', 'Christopher')
            .type('body > form > input[ng-model=pass]', 'ChristopherIsNotBest')
            .evaluate(function () {
                els = document.querySelectorAll('textarea');
                return Array.prototype.map.call(els, function (el) {
                    return el.value;
                });
            });
        var after_click = yield nightmare
            .click('#submit')
            .wait(1000)
            .evaluate(function () {
                els = document.querySelectorAll('textarea');
                return Array.prototype.map.call(els, function (el) {
                    return el.value;
                });
            });
        expect(before_click).to.not.deep.equal(after_click);
        expect(JSON.stringify(after_click).search(/error, cannot autheticate credentials./)).to.be.above(-1);
        expect(JSON.stringify(after_click).search(/^.+?\..+?\..+?$/)).to.equal(-1);
    });
    //The last test
    it('The server should not allow 100 login attempts, this test passes if the last bit of it fails.', function* () {

        yield nightmare
            .type('body > form > input[ng-model=user]', 'Christopher')
            .type('body > form > input[ng-model=pass]', 'ChristopherIsBest')
        for (var i = 0; i < 105; i++) {
            var before_click = yield nightmare
                .evaluate(function () {
                    els = document.querySelectorAll('textarea');
                    return Array.prototype.map.call(els, function (el) {
                        return el.value;
                    });
                });
            var after_click = yield nightmare
                .click('#submit')
                .wait(200)
                .evaluate(function () {
                    els = document.querySelectorAll('textarea');
                    return Array.prototype.map.call(els, function (el) {
                        return el.value;
                    });
                });
            if (JSON.stringify(before_click) !== JSON.stringify(after_click)) {
                expect(before_click).to.not.deep.equal(after_click);
                expect(JSON.stringify(after_click).search(/^.+?\..+?\..+?$/)).to.be.above(-1);
            }
            else {
                expect(before_click).to.deep.equal(after_click);
                expect(i).to.be.below(99);
                i = 106;
            }
        }
    });

});