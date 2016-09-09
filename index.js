var express = require('express');
var app = express();

var config = require('./config').config;
var loginCallback = require('./config').loginCallback;
var readmeConfig = require('./config').readmeConfig;
var utils = require('./utils');
var http = require('http');
var request = require('request');
var querystring = require('querystring');

var authorizationUri = '';

var oauth2 = require('simple-oauth2')({
  site: true, // Don't delete this, weird requirement of simple-oauth2
  clientSecret: config.clientSecret,
  clientID: config.clientID,
  authorizationPath: config.authorizationPath,
  tokenPath: config.tokenPath,
});

// Makes initail reqeust to oauth server
var redirect = function(req, res) {

  // Generates url using info from config
  var authorizationUri = oauth2.authCode.authorizeURL({
    redirect_uri: readmeConfig.redirect_uri,
    scope: config.scope,
    state: '',
  });

  res.redirect(authorizationUri);
};

// Handles requesting token and forming JWT url to readme
var callback = function(req, res) {

  var code = req.query.code;

  // Exchanges code for token
  oauth2.authCode.getToken({
    code: code,
    redirect_uri: readmeConfig.redirect_uri,
    client_id: config.clientID,
    client_secret: config.clientSecret,
  }, saveToken);

  // callback for getToken
  function saveToken(error, result) {
    if (error) { return res.status(500).send('Access Token Error: ' + error.message); }

    var token = oauth2.accessToken.create(result);

    if(typeof result === 'string') {
      result = querystring.parse(result);
    }

    // Fetches user information
    var reqOptions = {
      url: config.profilePath,
      json: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        'User-Agent': 'ReadMe',
        Authorization: `Bearer ${result.access_token}`,
      },
    };

    request(reqOptions, (err, r, body) => {

      // Transforms user information into readme format
      // More info on the format at https://readme.readme.io/v2.0/docs/passing-data-to-jwt
      var userData = loginCallback(body);

      // Redirects to readme JWT url
      return req.utils.jwt(userData);
    });
  }
};

app.use(express.cookieParser());

app.use(utils.readmeSetup);

app.get('/', utils.homePage);
app.get('/p/:project/oauth', redirect);
app.get('/p/:project/oauth/callback', callback);

var port = process.env.PORT || 3002;
app.listen(port);

console.log('Express server started on port ' + port);
