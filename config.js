exports.config = {
  clientID: '',
  clientSecret: '',
  authorizationPath: '',
  tokenPath: '',
  profilePath: '',
  scope: '',
};

// At this point the user has been authenticated and body contains
// the info your server returned about them.
// Return the user info you want to pass to readme
exports.loginCallback = function(body, accessToken) {
  // See https://docs.readme.com/main/docs/user-data-options for more specific info about the format
  return {
    email: body.email,
    name: body.name,
    apiKey: accessToken,
    version: 1,
  };
};

// Readme config -- automicatically configured for your project
exports.readmeConfig = {
  redirect_uri: 'https://oauth.readme.io/p/README_PROJECT/oauth/callback',
  readme_url: README_URL,
  jwt_secret: JWT_SECRET,
};
