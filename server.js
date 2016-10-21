//Server Dependencies init
var express = require('express'),
    app = express(),
    https = require('https'),
    pem = require('pem'),
    routes = require("./assets/routes.js"),
    compression = require('compression'),
    BodyParser = require('body-parser');


//Setup app folder serving Angular
app.use(express.static(__dirname + '/app'));

//gzip
app.use(compression());

//body parser urlencoded and json for post
app.use(BodyParser.urlencoded({
    extended: true
}));
app.use(BodyParser.json());

//Helmet to prevent targeted attacks
var helmet = require('helmet');
app.use(helmet());

//init routes
routes.setup(app);

//https credentials for dev
pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {

    //https options
    var credentials = {
        key: keys.serviceKey,
        cert: keys.certificate
    };

    //Create server
    var httpsServer = https.createServer(credentials, routes.app);

    //init listen and gradeful shutdown
    var httpsListener = httpsServer.listen(8443, function () {



        //wait for existing connections
        var gracefulShutdown = function () {
            //Received kill signal, shutting down gracefully.
            httpsListener.close(function () {
                process.exit();
            });
            // Shutdowntimeout
            setTimeout(function () {
                //forced
                process.exit()
            }, 10 * 1000);
        }

        //TERM
        process.on('SIGTERM', gracefulShutdown);

        //INT
        process.on('SIGINT', gracefulShutdown);
    });

    //for testing
    module.exports = httpsListener;

});//pem