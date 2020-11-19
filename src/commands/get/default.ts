import { SubcommandDefinition } from "clime";

export const subcommands: SubcommandDefinition[] = [
    {
        name: "apiPath",
        aliases: ["path", "api-path"],
        brief: "Get the current api path from the config file"
    },
    {
        name: "authType",
        aliases: ["auth", "auth-type"],
        brief: "Get the current auth type from the config file"
    },
    {
        name: "host",
        brief: "Get the current host from the config file"
    },
    {
        name: "ssl",
        brief: "Get the current ssl value from the config file"
    },
    {
        name: "username",
        alias: "user",
        brief: "Get the current username from the config file"
    }
];
