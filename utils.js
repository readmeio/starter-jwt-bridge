var sign = require('jsonwebtoken').sign;
var uuid = require('node-uuid');

exports.jwt = function(config, user) {
  var jwtOptions = {
    audience: 'readme.io',
    jwtid: uuid.v4()
  };

  var jwt = sign(user, config.jwt_secret, jwtOptions);
  return config.readme_url + "?auth_token=" + jwt;
};

// Todo make this actually show a real page
exports.homePage = function(req, res){
  return res.send("Successfully deployed! You should be redirected through the testing flow momentarily.")
}
