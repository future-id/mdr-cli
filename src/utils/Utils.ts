import path from "path";
import ora from "ora";
import Logger from "./Logger";
import TOML from "@iarna/toml";
import ofs, { promises as fs } from "fs";
import { Config, IConfig } from "./Config";
import { AuthType } from "./Types";

export const logger = new Logger();
export const spinner = ora("Loading");

// Platform dir only tested on linux Pop-OS 20.04
// According to google and stack overflow these paths should be correct for all systems
// There is a slight chance it might not properly work on some systems ¯\_(ツ)_/¯
export const PLATFORM_DIR = process.env.APPDATA || (process.platform === "darwin" ? `${process.env.HOME}/Library/Preferences` : `${process.env.HOME}/.config`);
export const CONFIG_DIR = path.join(PLATFORM_DIR, "mdr-cli");
export const CONFIG_FILE = path.join(CONFIG_DIR, "settings.toml");

export const defaultConf = `authType = "md5"
user = ""
password = ""
host = "manager.mijndomeinreseller.nl"
apiPath = "/api/"
useSSL = true`;

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

export function configExists(): boolean {
    const dirExists = ofs.existsSync(CONFIG_DIR);
    const fileExists = ofs.existsSync(CONFIG_FILE);
    return dirExists && fileExists;
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

export async function getConfig(): Promise<IConfig> {
    const toml = await fs.readFile(CONFIG_FILE, "utf-8");
    const cfg = (await TOML.parse.async(toml)) as IConfig;
    return new Config(cfg);
}

export function getConfigSync(): Config {
    const toml = ofs.readFileSync(CONFIG_FILE, "utf-8");
    const cfg = TOML.parse(toml) as IConfig;
    return new Config(cfg);
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
