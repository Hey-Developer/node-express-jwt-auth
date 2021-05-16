const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please, enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please, enter a valid Email Address"],
  },
  password: {
    type: String,
    required: [true, "Please, enter an password"],
    minLength: [6, "Password must be at least 6 characters"],
  },
});

//Now let's see How we will Hash a password when storing it in a database.
// There are two steps to do that:

//+ 1. Mongoose hooks, these are the functions which fires on after or before of certain event like if we have to fire a fucntion just after the document is save in our collection then we have to use mongoose post hook and if we have to fire before a document is save in our collection then we have to use mongoose pre hook.

//+2. Using Bcrypt Library and Pre mongoose hook to hash the password just before it save in our collection.

/* 
@ Fire A function after doc save to db.
> userSchema.post("save", function (doc, next) {
>   // doc contain the document which is saved in our collection.
>   // next is function that will called at the end of this middleware to pass on the flow otherwise program control will stuck on this function.
>   console.log(`New User Created and Save.`, doc);
>   next();
> });

*/

//@ Fire A function Before doc save to db.(we need this to hashed the password before saving it to database.)
userSchema.pre("save", async function (next) {
  // in THis we cannot use arrow functions because we want to access this keyword here which we will denote the current instance of User that is equal to the document which is going to be save in db.
  // console.log("User about to be saved", this);

  //# Hashing PassWord...
  // Step:1 Generating Salt..
  const salt = await bcrypt.genSalt();
  // Step:2 Hashing "salt+password"
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//@ Creating a Static Method to login user.
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  // we use this here because it represents the instance of userSchema which is the model.
  if (user) {
    // now if user is present with that email address, we will check weather the password is correct or not to do that we have to hashed that entered password again and then check it with the password stored in our database.
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new Error("Incorrect Password");
  } else {
    throw Error("Incorrect Email");
  }
};

module.exports = model("User", userSchema);

/* 
? How PassWord are Hash..
  Basically our plain string is processed under Hashing Algorithm which produces a long hashed string.
  But this alone is not enough hacker can use reverse engineering to decrypt the hashed string into plain string..
  Hence to increase the security we use Salting Process..
  
  + What is Salting:
  In this process a random string is add in the start of our plain password before the password is hashed.
  Note: we cannot convert the hashed password back into the plain password.
  So Then how do we authenticate the user next time he log in.
  Well we take the password and hashed it using the same algorithm and then verify that hashed password with the hashed password store in our database.

  + Bcrypt.js Methods:
    - To hash a password:
      Technique 1 (generate a salt and hash on separate function calls):
      > bcrypt.genSalt(saltRounds, function(err, salt) {
      >     bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
      >         // Store hash in your password DB.
      >     });
      > });  
    
      Technique 2 (auto-gen a salt and hash):
      > bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
      >     // Store hash in your password DB.
      > });

    - To check a password:
        // Load hash from your password DB.
      > bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
            // result == true
      > });
      > bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
            // result == false
      > });



*/
