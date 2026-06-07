import winston from 'winston';
import { existsSync, mkdirSync } from 'fs';

if (!existsSync('logs')) {
  mkdirSync('logs');
}

const { combine, timestamp, printf, colorize, align, json } = winston.format;

// FIX: Single logger — no duplicate console transport
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [
    // Console — debug level, colorized, timestamped
    new winston.transports.Console({
      level: 'debug',
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
      handleExceptions: true,
      handleRejections: true
    }),
    // File — info messages
    new winston.transports.File({
      filename: 'logs/info.log',
      level: 'info',
      format: combine(timestamp(), json()),
      maxsize: 5242880,
      maxFiles: 5
    }),
    // File — error messages
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(timestamp(), json()),
      maxsize: 5242880,
      maxFiles: 5
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'logs/exceptions.log',
      format: combine(timestamp(), json())
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: 'logs/rejections.log',
      format: combine(timestamp(), json())
    })
  ]
});

export default logger;
