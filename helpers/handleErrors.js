module.exports.handleErrors = (err) => {
  let errors = { email: "", password: "" };

  // Incorrect Email:
  if (err.message === "Incorrect Email") {
    errors.email = "This Email is not registered please enter correct email";
  }

  // Incorrect Password:
  if (err.message === "Incorrect Password") {
    errors.password = "Incorrect Password, please enter correct password";
  }

  // Duplicate error code:
  if (err.code === 11000) {
    errors.email = "That Email is already Registered";
    return errors;
  }

  // Validation Errors:
  if (err.message.includes(`User validation failed`)) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
