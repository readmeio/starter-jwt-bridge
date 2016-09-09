var sign = require('jsonwebtoken').sign;
var uuid = require('node-uuid');
var readmeConfig = require('./config').readmeConfig;

var jwt = function(req, res) {
  return function(user) {
    var jwtOptions = {
      audience: 'readme.io',
      jwtid: uuid.v4(),
    };

    var jwt = sign(user, readmeConfig.jwt_secret, jwtOptions);
    var jwtURL = readmeConfig.readme_url + '?auth_token=' + jwt;

    if(req.cookies.test) {
      res.clearCookie('test');
      return res.send(user);
    }else {
      return res.redirect(jwtURL);
    }
  };
};

// Todo make this actually show a real page
exports.homePage = function(req, res) {
  return res.send('Successfully deployed! You should be redirected through the testing flow momentarily.');
};

exports.readmeSetup = function(req, res, next) {
  req.utils = {
    jwt: jwt(req, res),
  };

  if(req.query.test) {
    res.cookie('test', 'true', { maxAge: 900000 });
  }

  next();
};
