import path from "path";
import ora from "ora";
import Logger from "./Logger";
import TOML, { AnyJson } from "@iarna/toml";
import ofs, { promises as fs } from "fs";

export const logger = new Logger();
export const spinner = ora("Loading");

export const PLATFORM_DIR = process.env.APPDATA || (process.platform === "darwin" ? `${process.env.HOME}/Library/Preferences` : `${process.env.HOME}/.config`);
export const CONFIG_DIR = path.join(PLATFORM_DIR, "mdr-cli");
export const CONFIG_FILE = path.join(CONFIG_DIR, "settings.toml");

export const defaultConf = `authType = "md5"
user = "" # mdr username
password = "" # mdr password
host = "manager.mijndomeinreseller.nl"
apiPath = "/api/"
useSSL = true`;

export type AuthType = "plain" | "md5";

export interface Config {
    authType: "plain" | "md5";
    user: string;
    password: string;
    host: string;
    apiPath: string;
    useSSL: boolean;
    [x: string]: AnyJson;
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function checkType(type: string): AuthType {
    switch (type) {
        case "plain":
        case "md5":
            return type;
        default:
            logger.error(`Invalid auth type in ${CONFIG_FILE}\nAuth type can only be md5 or plain`);
            process.exit(1);
    }
}

export async function createConfig(): Promise<void> {
    const dirExists = ofs.existsSync(CONFIG_DIR);
    if (!dirExists) {
        await fs.mkdir(CONFIG_DIR);
    }

    const fileExists = ofs.existsSync(CONFIG_FILE);
    if (!fileExists) {
        await fs.writeFile(CONFIG_FILE, defaultConf, "utf-8");
        logger.info(`Config file created at ${CONFIG_FILE}.\nPlease edit with a username and password before continuing!`);
        process.exit(0);
    }
}

export async function getConfig(): Promise<Config> {
    const toml = await fs.readFile(CONFIG_FILE, "utf-8");
    return (await TOML.parse.async(toml)) as Config;
}

export function getConfigSync(): Config {
    const toml = ofs.readFileSync(CONFIG_FILE, "utf-8");
    return TOML.parse(toml) as Config;
}

export function validateConfig(config: TOML.JsonMap): Config {
    if (!config.authType || typeof config.authType !== "string") {
        logger.error(`Invalid auth type in ${CONFIG_FILE}\nAuth type can only be md5 or plain`);
        process.exit(1);
    } else {
        checkType(config.authType);
    }

    if (!config.user || typeof config.user !== "string") {
        logger.error(`Invalid user defined in ${CONFIG_FILE}`);
        process.exit(1);
    }

    if (!config.password || typeof config.password !== "string") {
        logger.error(`Invalid password defined in ${CONFIG_FILE}`);
        process.exit(1);
    }

    if (!config.host || typeof config.host !== "string") {
        logger.error(`Invalid host defined in ${CONFIG_FILE}`);
        process.exit(1);
    }

    if (!config.apiPath || typeof config.apiPath !== "string") {
        logger.error(`Invalid api_path defined in ${CONFIG_FILE}`);
        process.exit(1);
    }

    if ((config.useSSL !== false && !config.useSSL) || typeof config.useSSL !== "boolean") {
        logger.error(`Invalid useSSL defined in ${CONFIG_FILE}`);
        process.exit(1);
    }

    if (config.useSSL === false && config.authType === "plain") {
        logger.error("When not using ssl the auth type has to be md5");
        process.exit(1);
    }

    return config as Config;
}

// Signature 1
export function yn(input: unknown, default_: boolean): boolean;
// Signature 2
export function yn(input: unknown, default_?: boolean): boolean | undefined;
// Implementation of both signatures (aka: implementation signature)
export function yn(input: unknown, default_?: boolean): boolean | undefined {
    const value = String(input).trim();

    if (/^(?:y|yes|true|1|on)$/i.test(value)) {
        return true;
    }

    if (/^(?:n|no|false|0|off)$/i.test(value)) {
        return false;
    }

    return default_;
}
