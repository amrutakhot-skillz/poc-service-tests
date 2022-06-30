"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const customFormat = winston_1.default.format.printf((i) => {
    return `[${i.level.toUpperCase()}] ${i.timestamp} ${i.label}: ${i.message}`;
});
const timestampFormat = winston_1.default.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS',
});
/**
 * The value defines the priority of the log, 0 having the highest priority.
 */
const customLevels = {
    error: 0,
    warn: 1,
    step: 2,
    info: 3,
    debug: 4,
};
/**
 * The configuration of the log files to be rotated.
 *
 * @param filePrefix filePrefix is used to differentiate between each log level file.
 * @returns {FileConfig} Returns the configuration of the log files to be rotated.
 */
const defaultRotationConfig = (filePrefix) => {
    return {
        filename: `logs/${filePrefix}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxSize: '100m',
        maxFiles: 10,
    };
};
/**
 * The configuration of the log file.
 *
 * @param filePrefix filePrefix is used to differentiate between each log file.
 * @returns {FileConfig} Returns the configuration of the log file.
 */
const singleFileConfig = (filePrefix) => {
    return {
        filename: `logs/${filePrefix}.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxSize: '100m',
        maxFiles: 1,
    };
};
class Logger {
    constructor(module) {
        const label = module.filename.split('/').pop().split('.')[0];
        this.customLogger = winston_1.default.createLogger({
            levels: customLevels,
            transports: [
                new winston_1.default.transports.Console({
                    level: 'step',
                    format: winston_1.default.format.combine(winston_1.default.format.label({ label: label }), timestampFormat, customFormat),
                }),
                new winston_1.default.transports.DailyRotateFile(Object.assign(Object.assign({}, defaultRotationConfig('combinedLogs')), { level: 'debug', format: winston_1.default.format.combine(winston_1.default.format.label({ label: label }), timestampFormat, customFormat) })),
                new winston_1.default.transports.File(Object.assign(Object.assign({}, singleFileConfig('scenario')), { level: 'debug', format: winston_1.default.format.combine(winston_1.default.format.label({ label: label }), timestampFormat, customFormat) })),
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
    logStep(message) {
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
    logInfo(message) {
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
    logWarn(message) {
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
    logError(message) {
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
    logDebug(message) {
        this.customLogger.debug(`${message}`);
    }
}
exports.default = Logger;
