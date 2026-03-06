 const appError = (msg, statusCode) => {
  const error = new Error(msg);
  error.status = statusCode;
  return error;
};

module.exports = appError;