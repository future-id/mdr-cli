import crypto from "crypto";
import urlcat from "urlcat";
import axios, { AxiosResponse } from "axios";
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
        if (this.config.authType === "md5") {
            this.password = crypto.createHash("md5").update(this.config.password).digest("hex");
        } else {
            this.password = this.config.password;
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
