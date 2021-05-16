  const express = require("express");
  const path = require("path");
  const db = require("./Database");
  const authRoutes = require("../routes/authRoutes");
  const bodyParser = require("body-parser");
  const morgan = require("morgan");
  const cookieParser = require("cookie-parser");
  const { checkAuth, currentUser } = require("../middlewares/authMiddlewares");

  //@ App Initialization:
  const app = express();

  //@ Static Variables:
  const port = process.env.PORT || 8000;
  const static_path = path.join(__dirname, "../public");
  const views_path = path.join(__dirname, "../views");

  //@ MiddleWares:
  app.use(express.static(static_path));
  app.use(morgan("dev"));
  app.use(cookieParser());

  //@ App Configuration:
  app.set("views", views_path);
  app.set("view engine", "ejs");

  //@ For Parsing Post Request Data
  //+ Now we will use bodyParser as middleware which will allow us to parse the incoming data from the client side such as in post request..
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  //@ Database Connection:
  const newDbConnection = new db();

  //@ Routes:
  app.get("*", currentUser); // we are sending the user detail to every get request hence we used "*" here.
  app.get("/", (req, res) => res.render("home"));
  app.get("/smoothies", checkAuth, (req, res) => res.render("smoothies"));

  //@ Auth Routes:
  app.use(authRoutes);

  //@ Starting the Server:
  app.listen(port, () => {
    console.log(
      `App is listening @ http://localhost:${port}, please wait for establishing database connection`
    );
  });
