import chalk from "chalk";
import { Logger as WinstonLogger, createLogger, format, transports } from "winston";
import { capitalize } from "./Utils";

class Logger {
    #log: WinstonLogger;

    public constructor() {
        this.#log = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp(),
                format.printf((log) => `${log.label ? chalk.black.bgGreen(`[${log.label}] `) : ""}${this._getColored(capitalize(log.level))}: ${log.message}`)
            ),
            transports: [new transports.Console()]
        });
    }

    public success(message: string): void {
        console.log(`${chalk.bold.greenBright("Success")}: ${message}`);
    }

    public info(message: string, label?: string): void {
        this.#log.info(message, { label });
    }

    public warn(message: string, label?: string): void {
        this.#log.warn(message, { label });
    }

    public error(error: Error | string, label?: string): void {
        if (typeof error === "string") {
            this.#log.error(error, { label });
        } else {
            this.#log.error(error.stack ? error.stack : error.toString(), { label });
        }
    }

    private _getColored(logLevel: string): string {
        if (logLevel === "Error") {
            return chalk.red.bold(logLevel);
        } else if (logLevel === "Warn") {
            return chalk.yellow.bold(logLevel);
        } else if (logLevel === "Info") {
            return chalk.blue.bold(logLevel);
        }

        return chalk.white(logLevel);
    }
}

export default Logger;
