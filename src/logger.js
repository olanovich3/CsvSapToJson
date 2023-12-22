import winston from 'winston'

export const log = () => {

    const {timestamp, combine, printf } = winston.format

const myFormat = printf(({ level, message, timestamp }) => {
  return ` ${level}: ${message} ${timestamp}`
})

const logger = winston.createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),myFormat) ,
  transports: [
    new winston.transports.File({ filename: './logger/logfile.log' }),
    
  ]
})
return logger
}
