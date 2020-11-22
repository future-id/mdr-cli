import chalk from "chalk";
import { Logger as WinstonLogger, createLogger, format, transports } from "winston";
import { capitalize } from "./Utils";

type LogLevel = {
    ERROR: "error";
    WARN: "warn";
    INFO: "info";
}

class Logger {
    #log: WinstonLogger;

    constructor() {
        this.#log = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp(),
                format.printf((log) => `${log.label ? chalk.black.bgGreen(`[${log.label}] `) : ""}${this._getColored(log.level)}: ${log.message}`)
            ),
            transports: [new transports.Console()]
        });
    }

    static Level: LogLevel = {
        ERROR: "error",
        WARN: "warn",
        INFO: "info"
    }

    /**
     * Log without any extras, just pure text
     * @param message The message to log
     */
    log(message: unknown): void {
        console.log(message);
    }

    /**
     * Log success messages
     * @param message The message to log
     */
    success(message: string): void {
        console.log(`${chalk.bold.greenBright("Success")}: ${message}`);
    }

    /**
     * Log info messages
     * @param message The message to log
     * @param label A label to put at the beginning of the line
     */
    info(message: string, label?: string): void {
        this.#log.info(message, { label });
    }

    /**
     * Log warning message
     * @param message The message to log
     * @param label A label to put at the beginning of the line
     */
    warn(message: string, label?: string): void {
        this.#log.warn(message, { label });
    }

    /**
     * Log error message
     * @param message The message to log
     * @param label A label to put at the beginning of the line
     */
    error(error: Error | string, label?: string): void {
        if (typeof error === "string") {
            this.#log.error(error, { label });
        } else {
            this.#log.error(error.stack ? error.stack : error.toString(), { label });
        }
    }

    /**
     * Get the color according to the log level
     * @param logLevel
     */
    private _getColored(logLevel: string): string {
        const level = logLevel.toLowerCase();
        const newLevel = capitalize(level);
        switch (level) {
            case Logger.Level.ERROR:
                return chalk.red.bold(newLevel);
            case Logger.Level.WARN:
                return chalk.yellow.bold(newLevel);
            case Logger.Level.INFO:
                return chalk.blue.bold(newLevel);
            default:
                return chalk.white(newLevel);
        }
    }
}

export default Logger;
