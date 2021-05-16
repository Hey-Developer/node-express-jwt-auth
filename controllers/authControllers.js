const User = require("../models/Users");
const cookie = require("cookie-parser");
const { handleErrors } = require("../helpers/handleErrors");
const { createToken } = require("../helpers/createToken");

module.exports.signup_get = (req, res, next) => {
  res.render("signup");
};

module.exports.login_get = (req, res, next) => {
  res.render("login");
};

module.exports.signup_post = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const result = await User.create({ email, password });
    // Creating Token
    const token = createToken(result._id);
    // Sending token with cookie.
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ user: result._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json({ errors });
  }
};

module.exports.login_post = async (req, res, next) => {
  const { email, password } = req.body;
  // Now here we have to do a lot of work i.e we take the credentials then first check the email and then the hash the password and then check that hashed password with the password present in our database then if both of these is present in our db then we will authenticate user and send a jwt token to the browser.
  // this will be so easy if we have a method like this. User.login(email,password)
  // well there is no such method but we can create such method in our userSchema using statics method. So let's go in our user model and create a static method.
  try {
    const user = await User.login(email, password);
    // Creating Token
    const token = createToken(user._id);
    // Sending token with cookie.
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json({ errors });
  }
};

module.exports.logout_get = (req, res, next) => {
  // Well to logout we just have to delete our cookie
  // But remember we are on server side so we can't delete cookie which stored on client side.
  // Instead we can replace that same cookie with a blank value and with a short expiry date.
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
