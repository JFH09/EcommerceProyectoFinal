class CustomErrors {
  static createError({ name = "Error", cause, message, code = 1 }) {
    const error = new Error(message);
    error.cause = cause;
    error.name = name;
    error.code = code;
    // console.log("en customerrors 7-", error);
    throw error;
  }
}

export default CustomErrors;
