import crypto from "crypto";
import isBase64 from "is-base64";
import urlcat from "urlcat";
import chalk from "chalk";
import axios, { AxiosResponse } from "axios";
import { name } from "../package.json";
import { Config, getConfig, logger, spinner, validateConfig } from "./utils/Utils";

type ParsedData = Record<string, string>;
type Query = Record<string, string>;

class Api {
    config!: Config;
    password!: string;
    #query: Query = {};
    #intitialized = false;

    async init(): Promise<void> {
        this.config = await getConfig();
        validateConfig(this.config);

        const b64 = isBase64(this.config.password);
        if (b64) {
            this.password = Buffer.from(this.config.password, "base64").toString("utf-8");
        } else {
            spinner.stop();
            logger.warn(
                "\nYour password is saved as plain text, this can happen because of three things:\n" +
                "- You manually change the config file (please don't do this)\n" +
                "- You're running an old version\n" +
                "- You updated to v1 but haven't updated your config file yet\n\n" +
                chalk.bold("To fix this follow these steps:\n") +
                `1. Update mdr to the latest version ${chalk.bold(`npm i -g ${name}@latest`)}\n` +
                `2. Update your password using ${chalk.bold("mdr set password <password>")} (replace ${chalk.bold("<password>")} with your actual password)`
            );
            process.exit(1);
        }

        if (this.config.authType === "md5") {
            this.password = crypto.createHash("md5").update(this.password).digest("hex");
        }
        this.#intitialized = true;
    }

    newRequest(): void {
        this.#query = {};
    }

    addParam(name: string, value: string): void {
        this.#query[name] = encodeURIComponent(value);
    }

    private _parse(data: string): ParsedData {
        const result: Record<string, string> = {};
        const lines = data.split("\n");
        const lineCount = lines.length;

        for (let i = 0; i < lineCount; i++) {
            if (lines[i].substr(1, 1) !== ";") {
                const [key, value] = lines[i].split("=");
                result[key] = value;
            }
        }

        return result;
    }

    async send(): Promise<ParsedData> {
        if (!this.#intitialized) {
            logger.error("Tried to send before class finished initializing");
            process.exit(1);
        }

        this.addParam("user", this.config.user);
        this.addParam("pass", this.password);
        this.addParam("authtype", this.config.authType);

        let response: AxiosResponse<string>;
        if (this.config.useSSL) {
            response = await axios.get(urlcat(`https://${this.config.host}:443`, this.config.apiPath, this.#query));
        } else {
            response = await axios.get(urlcat(`http://${this.config.host}:80`, this.config.apiPath, this.#query));
        }

        const parsed = this._parse(response.data);

        let errcount = 0;
        try {
            errcount = parseInt(parsed.errcount);
        } catch (e) {
            // errcount == 0
        }

        if (errcount >= 1) {
            spinner.stop();
            for (let i = 1; i <= errcount; i++) {
                logger.error(`[${parsed["errno" + i]}] ${parsed["errnotxt" + i]}`);
            }
            process.exit(1);
        }

        spinner.stop();
        return parsed;
    }
}

export default Api;
