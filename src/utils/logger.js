import winston from "winston";
import config from "../config/config.js";
const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "magenta",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "cyan",
    debug: "green",
    //'cyan', white
  },
};

const loggerDesarrollo = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./error.log",
      level: "warning",
      format: winston.format.simple(),
    }),
  ],
});

const loggerProduccion = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./error.log",
      level: "warning",
      format: winston.format.simple(),
    }),
  ],
});

// const logger = winston.createLogger({
//   transports: [
//     new winston.transports.Console({ level: "http" }),
//     new winston.transports.File({ filename: "./error.log", level: "warn" }),
//   ],
// });
export const logger =
  config.enviroment === "PRODUCTION" ? loggerProduccion : loggerDesarrollo;

export const addLogger = (req, res, next) => {
  req.logger = logger;
  //   req.logger.http(
  //     `${req.method} en ${req.url} - ${new Date().toLocaleTimeString}`
  //   );
  next();
};
