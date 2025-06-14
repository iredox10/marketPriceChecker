
/**
 * Middleware to handle requests for routes that don't exist.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware (our error handler)
};

/**
 * Centralized error handling middleware.
 * This catches all errors passed via next() from any route.
 */
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come in with a 200 status code, we want to default to 500 if that's the case.
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Send a structured JSON response
  res.json({
    message: err.message,
    // Show the stack trace only if we are not in production for debugging
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
