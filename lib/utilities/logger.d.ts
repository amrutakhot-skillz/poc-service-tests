/// <reference types="node" />
import winston from 'winston';
import 'winston-daily-rotate-file';
interface CustomLevelLogger extends winston.Logger {
    step: winston.LeveledLogMethod;
}
export default class Logger {
    customLogger: CustomLevelLogger;
    constructor(module: NodeModule);
    /**
     * Generates a log message that represents a manual test step.
     *
     * Typically used prior to performing any testing action- clicking,
     * navigating, launching, inputting, etc. The steps need to manually rerun
     * an automated test.
     *
     * @param message The manual test step.
     */
    logStep(message: string): void;
    /**
     * Generates a log message containing supplemental testing information.
     *
     * Typically used to log test data details. Or to provide additional
     * information when performing an action.
     *
     * @param message The supplemental testing information.
     */
    logInfo(message: string): void;
    /**
     * Generates a log message containing a warning.
     *
     * Typically used to warn that a testing step did not occur as expected but
     * the test will continue.
     *
     * @param message The warning.
     */
    logWarn(message: string): void;
    /**
     * Generates a log message containing an error.
     *
     * Typically used to record errors and exceptional events. The message
     * should contain details on how to troubleshoot or resolve the error.
     *
     * @param message The error.
     */
    logError(message: string): void;
    /**
     * Generates a log message containing debug details.
     *
     * Typically used to record extremely detailed (verbose) information
     * regarding the running state of the framework and its dependencies.
     *
     * @param message The debug details.
     */
    logDebug(message: string): void;
}
export {};
