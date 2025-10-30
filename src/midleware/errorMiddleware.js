export const errorHandler = (err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
};
