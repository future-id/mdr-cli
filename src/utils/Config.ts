import crypto from "crypto";
import chalk from "chalk";
import isBase64 from "is-base64";
import TOML from "@iarna/toml";
import { name } from "../../package.json";
import { AuthType } from "./Types";
import { CONFIG_FILE, logger, checkType } from "./Utils";

export class IndexSignature {
    [k: string]: any;
    [k: number]: undefined;
}

export interface IConfig extends TOML.JsonMap {
    authType: AuthType;
    user: string;
    password: string;
    host: string;
    apiPath: string;
    useSSL: boolean;
}

export class Config extends IndexSignature implements IConfig {
    authType!: AuthType;
    user!: string;
    password!: string;
    host!: string;
    apiPath!: string;
    useSSL!: boolean;

    #originalPassword: string;

    constructor(data: IConfig) {
        super();

        this.#originalPassword = data.password;
        Object.assign(this, data);
    }

    validate(): Config {
        if (!this.authType || typeof this.authType !== "string") {
            logger.error(
                `Invalid auth type in ${CONFIG_FILE}\n` +
                "Auth type can only be md5 or plain"
            );
            process.exit(1);
        } else {
            checkType(this.authType);
        }

        if (!this.user || typeof this.user !== "string") {
            logger.error(`Invalid user defined in ${CONFIG_FILE}`);
            process.exit(1);
        }

        if (!this.password || typeof this.password !== "string") {
            logger.error(`Invalid password defined in ${CONFIG_FILE}`);
            process.exit(1);
        }

        // Check if saved password is base64 encoded
        // Warn the user if not and exit the process
        const b64 = isBase64(this.#originalPassword);
        if (!b64) {
            logger.warn(
                "\nYour password is saved as plain text, this can happen because of three reasons:\n" +
                `1. You manually changed the config file ${chalk.bold("(it is recommended to not do this)")}\n` +
                "2. You're running an old version\n" +
                "3. You just updated to version >= 1.0.0 but haven't updated your config file yet\n\n" +
                chalk.bold("To fix this follow these steps:\n") +
                `1. Update mdr to the latest version ${chalk.bold(`npm i -g ${name}@latest`)}\n` +
                `2. Update your password using ${chalk.bold("mdr set password <password>")} (replace ${chalk.bold("<password>")} with your actual password)`
            );
            process.exit(1);
        }

        if (!this.host || typeof this.host !== "string") {
            logger.error(`Invalid host defined in ${CONFIG_FILE}`);
            process.exit(1);
        }

        if (!this.apiPath || typeof this.apiPath !== "string") {
            logger.error(`Invalid api_path defined in ${CONFIG_FILE}`);
            process.exit(1);
        }

        if ((this.useSSL !== false && !this.useSSL) || typeof this.useSSL !== "boolean") {
            logger.error(`Invalid useSSL defined in ${CONFIG_FILE}`);
            process.exit(1);
        }

        if (this.useSSL === false && this.authType === "plain") {
            logger.error("When not using ssl the auth type has to be md5");
            process.exit(1);
        }

        // Decode base64 password
        this.password = Buffer.from(this.#originalPassword, "base64").toString("utf-8");

        // If auth type is md5 encode password to md5 hash
        if (this.authType === "md5") {
            this.password = crypto.createHash("md5").update(this.password).digest("hex");
        }

        return this;
    }
}
