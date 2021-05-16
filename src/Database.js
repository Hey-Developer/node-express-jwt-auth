const mongoose = require("mongoose");

const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const connectionString = `mongodb+srv://cloves:${dbPass}@node-express-jwt-auth-d.zbpuc.mongodb.net/${dbName}?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose
      .connect(connectionString, options)
      .then(() => {
        console.log("MongoDb ATLAS Connection SuccessFul");
      })
      .catch((err) => {
        console.log(`MongoDB ATLAS Connection Unsuccessful: ${err.message}`);
      });
  }
}

module.exports = Database;
