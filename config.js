exports.config = {
  clientID: "",
  clientSecret: "",
  authorizationPath: "",
  tokenPath: "",
  profilePath: "",
  scope: "",
};

// This is the callback after the last step of the oauth flow
// At this point the user has been authenticated and body contains
// the info your server returned about them.
exports.loginCallback = function(err, req, body){
  
  // This redirects to readme in a secure way with the user info
  // See readme.readme.io/jwt for more specific info about the format
  res.redirect(utils.jwt(readme_config, {
  	'email': body.email,
    'name': body.name,
    'keys': {
			api_key: body.api_key,
      name: body.project_name
    }
  }));
};

// Readme config -- automicatically configured for your project
exports.readmeConfig = {
  redirect_uri: "http://localhost:3002/p/README_PROJECT/oauth/callback",
  readme_url: README_URL,
  jwt_secret: JWT_SECRET
};
