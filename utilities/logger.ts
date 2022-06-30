import winston from 'winston';
import 'winston-daily-rotate-file';

const customFormat = winston.format.printf((i) => {
  return `[${i.level.toUpperCase()}] ${i.timestamp} ${i.label}: ${i.message}`;
});

const timestampFormat = winston.format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss.SSS',
});

/**
 * The value defines the priority of the log, 0 having the highest priority.
 */
const customLevels: winston.config.AbstractConfigSetLevels = {
  error: 0,
  warn: 1,
  step: 2,
  info: 3,
  debug: 4,
};

interface CustomLevelLogger extends winston.Logger {
  step: winston.LeveledLogMethod;
}

interface FileConfig {
  filename: string;
  datePattern: string;
  zippedArchive: boolean;
  maxSize: string;
  maxFiles: number;
}

/**
 * The configuration of the log files to be rotated.
 *
 * @param filePrefix filePrefix is used to differentiate between each log level file.
 * @returns {FileConfig} Returns the configuration of the log files to be rotated.
 */
const defaultRotationConfig = (filePrefix: string) => {
  return {
    filename: `logs/${filePrefix}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '100m',
    maxFiles: 10,
  } as FileConfig;
};

/**
 * The configuration of the log file.
 *
 * @param filePrefix filePrefix is used to differentiate between each log file.
 * @returns {FileConfig} Returns the configuration of the log file.
 */
const singleFileConfig = (filePrefix: string) => {
  return {
    filename: `logs/${filePrefix}.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '100m',
    maxFiles: 1,
  } as FileConfig;
};

export default class Logger {
  customLogger: CustomLevelLogger;

  constructor(module: NodeModule) {
    const label = module.filename.split('/').pop().split('.')[0];

    this.customLogger = <CustomLevelLogger>winston.createLogger({
      levels: customLevels,
      transports: [
        new winston.transports.Console({
          level: 'step',
          format: winston.format.combine(
            winston.format.label({ label: label }),
            timestampFormat,
            customFormat
          ),
        }),
        new winston.transports.DailyRotateFile({
          ...defaultRotationConfig('combinedLogs'),
          level: 'debug',
          format: winston.format.combine(
            winston.format.label({ label: label }),
            timestampFormat,
            customFormat
          ),
        }),
        new winston.transports.File({
          ...singleFileConfig('scenario'),
          level: 'debug',
          format: winston.format.combine(
            winston.format.label({ label: label }),
            timestampFormat,
            customFormat
          ),
        }),
      ],
    });
  }

  /**
   * Generates a log message that represents a manual test step.
   *
   * Typically used prior to performing any testing action- clicking,
   * navigating, launching, inputting, etc. The steps need to manually rerun
   * an automated test.
   *
   * @param message The manual test step.
   */
  logStep(message: string): void {
    this.customLogger.step(`${message}`);
  }

  /**
   * Generates a log message containing supplemental testing information.
   *
   * Typically used to log test data details. Or to provide additional
   * information when performing an action.
   *
   * @param message The supplemental testing information.
   */
  logInfo(message: string): void {
    this.customLogger.info(`${message}`);
  }

  /**
   * Generates a log message containing a warning.
   *
   * Typically used to warn that a testing step did not occur as expected but
   * the test will continue.
   *
   * @param message The warning.
   */
  logWarn(message: string): void {
    this.customLogger.warn(`${message}`);
  }

  /**
   * Generates a log message containing an error.
   *
   * Typically used to record errors and exceptional events. The message
   * should contain details on how to troubleshoot or resolve the error.
   *
   * @param message The error.
   */
  logError(message: string): void {
    this.customLogger.error(`${message}`);
  }

  /**
   * Generates a log message containing debug details.
   *
   * Typically used to record extremely detailed (verbose) information
   * regarding the running state of the framework and its dependencies.
   *
   * @param message The debug details.
   */
  logDebug(message: string): void {
    this.customLogger.debug(`${message}`);
  }
}
