const { createLogger, format, transports } = require('winston');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD:mm:ss' }),
        format.printf(info => `[${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`)
    ),
    transports: [
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error '}),
        new transports.File({ filename: path.join(logDir, 'combined.log')})
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
}

module.exports = logger;