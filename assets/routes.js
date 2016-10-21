module.exports.setup = function (app) {
  //handlers
  var routeHandlers = require("./routeHandlers.js");
  

  //init API routes
  app.post("/auth", routeHandlers.auth());
  app.get("/superSecretTestEndPoint", routeHandlers.validate());

  //Angular route
  app.get('/', function (req, res) {
    res.render('/index.html');
  });
  module.exports.app = app;
}