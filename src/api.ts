import urlcat from "urlcat";
import axios, { AxiosResponse } from "axios";
import { Config } from "./utils/Config";
import { ParsedData, Query } from "./utils/Types";
import { getConfigSync, logger, spinner } from "./utils/Utils";

class Api {
    config: Config;
    #query: Query = {};
    #intitialized = false;

    constructor() {
        this.config = getConfigSync();
        this.config.validate();
        this.#intitialized = true;
    }

    newRequest(): void {
        this.#query = {};
    }

    addParam(name: string, value: string): void {
        this.#query[name] = encodeURIComponent(value);
    }

    private _parse(data: string): ParsedData {
        const result: ParsedData = {};
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
        this.addParam("pass", this.config.password);
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
