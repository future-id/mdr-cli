import path from "path";
import ora from "ora";
import chalk from "chalk";
import Logger from "./Logger";
import TOML from "@iarna/toml";
import ofs, { promises as fs } from "fs";
import { Config, ConfigType } from "./Config";
import { AuthType } from "./Types";
import { name } from "../../package.json";

export const logger = new Logger();
export const spinner = ora("Loading");

export const fileName = "settings";
export const fileType = "toml";

// Platform dir only tested on linux Pop-OS 20.04
// According to google and stack overflow these paths should be correct for all systems
// There is a slight chance it might not properly work on some systems ¯\_(ツ)_/¯
export const PLATFORM_DIR = process.env.APPDATA || (process.platform === "darwin" ? `${process.env.HOME}/Library/Preferences` : `${process.env.HOME}/.config`);
export const CONFIG_DIR = path.join(PLATFORM_DIR, name);
export const CONFIG_FILE = path.join(CONFIG_DIR, `${fileName}.${fileType}`);

export const defaultConf = `authType = "md5"
user = ""
password = ""
host = "manager.mijndomeinreseller.nl"
apiPath = "/api/"
useSSL = true
lastNotification = ${Date.now()}`;

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function checkType(type: string): AuthType {
    switch (type) {
        case "plain":
        case "md5":
            return type;
        default:
            logger.error(
                `Invalid auth type in ${CONFIG_FILE}\n` +
                "Auth type can only be md5 or plain"
            );
            process.exit(1);
    }
}

export function isYarnGlobal(): boolean {
    const yarnPath = process.platform === "win32" ? path.join("Yarn", "config", "global") : path.join(".config", "yarn", "global");
    return __dirname.includes(yarnPath);
}

export function isYarnLocal(): boolean {
    return ofs.existsSync(path.resolve(process.cwd(), "yarn.lock"));
}

export function isYarn(): boolean {
    return (isYarnLocal() || isYarnGlobal());
}

export function isDev(): boolean {
    return process.env.NODE_ENV === "development";
}

export function isDebug(): boolean {
    return yn(process.env.MDR_DEBUG, false);
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
        logger.info(
            `Config file created at ${CONFIG_FILE}.\n` +
            `Please set a username and password using ${chalk.bold("mdr set")} command before continuing!\n` +
            "It is recommended to not manually edit this file."
        );
        process.exit(0);
    }
}

export async function getConfig(): Promise<Config> {
    const toml = await fs.readFile(CONFIG_FILE, "utf-8");
    const cfg = (await TOML.parse.async(toml)) as ConfigType;
    return new Config(cfg);
}

export function getConfigSync(): Config {
    const toml = ofs.readFileSync(CONFIG_FILE, "utf-8");
    const cfg = TOML.parse(toml) as ConfigType;
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
