import { createLogger, format, transports } from 'winston';
import envVar from '@core/env';

const logFormat = format.printf(({ timestamp, level, message, stack }) => {
    const log = `[ ${timestamp.replace(/[TZ]/gm, ' ')}] ${level}: ${message}`;

    return stack ? `${log}\n${stack}` : log;
});

const logger = createLogger({
    level: process.env.NODE_ENV === 'production' ? (envVar('LOG_LEVEL', 'info') as string) : 'debug',
    format: format.combine(format.errors({ stack: true }), format.timestamp(), format.colorize(), format.prettyPrint(), format.simple(), logFormat),
    transports: [new transports.Console()],
    exceptionHandlers: [new transports.Console()],
});

export default logger;
