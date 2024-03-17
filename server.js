'use strict';

module.exports = function startTwitterProxyServer(config) {
  /**
   * Setup the server
   */
  let express = require('express'),
      http = require('http'),
      app = express();
      var cors = require('cors')
  let proxy = require('./proxy');

  // Save the config for use later
  app.set('config', config);
  // All environments
  app.set('port', config.port || 7890);
  // Logging
  app.use(express.logger('dev'));
  // gzip
  app.use(express.compress());
  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(cors({
    allowedHeaders: '*'
  }));
  // CORS

  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

      if (req.method === 'OPTIONS')
          return res.send(200);

      next();
  });

  // Express routing
  app.use(app.router);

  // Set up the routes
  proxy.route(app);

  /**
   * Get the party started
   */
  http.createServer(app)
      .listen(app.get('port'), function () {
        console.log('twitter-proxy server ready: http://localhost:' + app.get('port'));
      });
};