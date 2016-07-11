var express = require('express');
var app = express();

var config = require('./config').config;
var readme_config = require('./config').readmeConfig;
var utils = require('./utils');
var http = require('http');

var authorization_uri = '';

var oauth2 = require('simple-oauth2')({
  site: true, // Don't delete this, weird requirement of simple-oauth2
  clientSecret: config.clientSecret,
  clientID: config.clientID,
  authorizationPath: config.authorizationPath,
  tokenPath: config.tokenPath,
});

var redirect = function(req, res) {

  // Authorization uri definition
  var authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: readme_config.redirect_uri,
    scope: config.scope,
    state: ''
  });

  res.redirect(authorization_uri);
};

var callback = function(req, res) {

  var code = req.query.code;

  oauth2.authCode.getToken({
    code: code,
    redirect_uri: readme_config.redirect_uri,
    client_id: config.clientID,
    client_secret: config.clientSecret,
  }, saveToken);

  function saveToken(error, result) {
    if (error) { console.log('Access Token Error', error.message); }
    token = oauth2.accessToken.create(result);

    var params = params || {};
    var request = require('request');
    var querystring = require('querystring');

    if(typeof result === 'string'){
      result = querystring.parse(result);
    }

    var req_options = {
      url: config.profilePath,
      json: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Accept": "application/json",
        'User-Agent': 'ReadMe',
        'Authorization': `Bearer ${result.access_token}`
      }
    };

    request(req_options, function(err, req, body) {
      // TODO-JWT Figure out how to make this obvious
      res.redirect(utils.jwt(readme_config, {
        'email': body.email,
        'name': body.name,
        'keys': {
          api_Key: '12345',
          name: "Marc's Project"
        }
      }));
    });
  }
};

app.get('/', utils.homePage);
app.get('/p/:project/oauth', redirect);
app.get('/p/:project/oauth/callback', callback);

var port = process.env.PORT || 3001
app.listen(port);

console.log('Express server started on port ' + port);