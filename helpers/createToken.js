const jwt = require("jsonwebtoken");

module.exports.createToken = (id) => {
  // id here is the unique user id assigned by mdb db to each user.
  // we will use this id as the payload in our jwt.
  // To create token we will use jwt.sign(payload, secretOrPrivateKey, [options, callback])
  // (Asynchronous) If a callback is supplied, the callback is called with the err or the JWT.
  // (Synchronous) Returns the JsonWebToken as string.

  return jwt.sign({ id }, "cloves_secret_0926", {
    expiresIn: 3 * 24 * 60 * 60,
  });
};
