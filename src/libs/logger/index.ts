import winston, { createLogger } from 'winston'

export const appLogger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
})
