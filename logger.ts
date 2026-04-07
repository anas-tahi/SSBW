import winston from 'winston';

// Create logs directory if it doesn't exist
import { existsSync, mkdirSync } from 'fs';
if (!existsSync('logs')) {
  mkdirSync('logs');
}

// Define custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.align(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// Define format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger instance
const logger = winston.createLogger({
  level: 'debug',
  format: fileFormat,
  defaultMeta: { service: 'tienda-prado' },
  transports: [
    // Console transport for debug messages (colorized, timestamped)
    new winston.transports.Console({
      level: 'debug',
      format: consoleFormat,
      handleExceptions: true,
      handleRejections: true
    }),
    
    // File transport for info messages (logs/info.log)
    new winston.transports.File({
      filename: 'logs/info.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // File transport for error messages (logs/error.log)
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  
  // Handle uncaught exceptions and unhandled promise rejections
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/exceptions.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: 'logs/rejections.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// If we're not in production, also log to the console with a simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
