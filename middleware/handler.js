const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

const globalErrorHandler = (err, req, res, next) => {
  console.log(err.message, err.status);
  
  res.status(err.status || 500).json({
    msg: err.msg || "something went wrong",
    error: err.message,
  });
};

module.exports = { asyncHandler, globalErrorHandler };
