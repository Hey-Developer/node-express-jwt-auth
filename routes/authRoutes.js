const { Router } = require("express");
const {
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout_get,
} = require("../controllers/authControllers");

const router = Router();
/* 
? Are you thinking that why we use  get and post routes for same route.
  + Let me explain you..
  + The GET route on /signup is to provide the view of signup form &
  + The POST route on /signup will be used in the registration form to send the data to te server.
  Similarly
  + The GET route on /login is to provide the view of login form, & 
  + The POST route on /login will be used in the registration form to send the login credentials to the backend to verify.

*/
router.get("/signup", signup_get);
router.post("/signup", signup_post);
router.get("/login", login_get);
router.post("/login", login_post);
router.get("/logout", logout_get);

module.exports = router;
