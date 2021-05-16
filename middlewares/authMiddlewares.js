const jwt = require("jsonwebtoken");
const User = require("../models/Users");

module.exports.checkAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check json web token is exist & is Verified.
  if (token) {
    jwt.verify(token, "cloves_secret_0926", (err, result) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

module.exports.currentUser = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check json web token is exist & is Verified.
  if (token) {
    jwt.verify(token, "cloves_secret_0926", async (err, result) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(result.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
