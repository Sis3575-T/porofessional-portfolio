export const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  console.error(err.stack);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors || [err.message],
      timestamp: new Date().toISOString(),
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      timestamp: new Date().toISOString(),
    });
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File too large. Maximum size is 10MB.",
      timestamp: new Date().toISOString(),
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
};
