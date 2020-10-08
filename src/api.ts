import crypto from "crypto";
import { Config, getConfig } from "./utils";
import axios, { AxiosResponse } from "axios";

type ParsedData = Record<string, string>;

class Api {
    config!: Config;
    password!: string;
    #query = "";
    #intitialized = false;

    async init(): Promise<void> {
        this.config = await getConfig();
        if (this.config.authType === "md5") {
            this.password = crypto.createHash("md5").update(this.config.password).digest("hex");
        }
        this.#intitialized = true;
    }

    newRequest(): void {
        this.#query = "";
    }

    addParam(name: string, value: string): void {
        this.#query += `${name}=${encodeURIComponent(value)}&`;
    }

    // errcount=1
    // errno1=000005
    // errnotxt1=Ongeldig ipadres
    // done=true
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
            throw Error("Tried to send before class finished initializing");
        }

        this.addParam("user", this.config.user);
        this.addParam("pass", this.password);
        this.addParam("authtype", this.config.authType);

        let port = 80;
        let response: AxiosResponse<string>;
        if (this.config.useSSL) {
            port = 443;
            response = await axios.get(`ssl://${this.config.host}${this.config.apiPath}:${port}${this.#query}`);
        } else {
            response = await axios.get(`https://${this.config.host}${this.config.apiPath}:${port}${this.#query}`);
        }

        return this._parse(response.data);
    }
}

export default Api;
