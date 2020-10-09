#! /usr/bin/env node

import path from "path";
import { constants, promises as fs } from "fs";
import { CLI, Shim } from "clime";
import { CONFIG_DIR, CONFIG_FILE, getConfig, logger } from "./utils/Utils";

const defaults = `authType = "md5"
user = "" # mdr username
password = "" # mdr password
host = "manager.mijndomeinreseller.nl"
apiPath = "/api/"
useSSL = true`;

async function main(): Promise<void> {
    try {
        await fs.access(CONFIG_DIR, constants.F_OK | constants.W_OK | constants.R_OK);
    } catch (e) {
        await fs.mkdir(CONFIG_DIR);
    }

    try {
        await fs.access(CONFIG_FILE, constants.F_OK | constants.W_OK | constants.R_OK);
    } catch (e) {
        await fs.writeFile(CONFIG_FILE, defaults, "utf-8");
        logger.info(`Config file created at ${CONFIG_FILE}. Please edit with a username and password before continuing!`);
        process.exit(0);
    }

    // Validate config
    await getConfig();

    // When in development and we use ts-node make sure the commands loaded use .ts extension
    if (process.env.NODE_ENV === "development" && __filename.endsWith(".ts")) {
        CLI.commandModuleExtension = ".ts";
    }

    const cli = new CLI("mdr", path.join(__dirname, "commands"));

    const shim = new Shim(cli);
    shim.execute(process.argv);
}

main().catch((e) => {
    logger.error(e);
    process.exit(1);
});
