const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

exports.log = function (req, res, next) {
  logger.info(
    `Request info: ${req.method} ${req.originalUrl} ${req.ip} ${req.headers["user-agent"]}`
  );
  next();
  res.on("finish", () => {
    logger.info(`Response Status: ${res.statusCode}`);
  });
};

exports.logError = function (err) {
  logger.error(err);
};
