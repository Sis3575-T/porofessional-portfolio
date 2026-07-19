const requestCounts = new Map();

export const rateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const timestamps = requestCounts.get(ip);
    const windowStart = now - windowMs;

    const recentTimestamps = timestamps.filter((t) => t > windowStart);
    requestCounts.set(ip, recentTimestamps);

    if (recentTimestamps.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    recentTimestamps.push(now);
    next();
  };
};
