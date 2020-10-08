import { SubcommandDefinition } from "clime";

export const subcommands: SubcommandDefinition[] = [
    {
        name: "apiPath",
        alias: "path",
        brief: "Update api path in config file"
    },
    {
        name: "authType",
        alias: "auth",
        brief: "Update auth type in config file (plain or md5)"
    },
    {
        name: "host",
        brief: "Update host in config file"
    },
    {
        name: "password",
        aliases: ["pwd", "pw", "pass", "passwd"],
        brief: "Update the password in the config file"
    },
    {
        name: "ssl",
        brief: "Enable or disable ssl in the config file, when disabled auth type has to be md5"
    },
    {
        name: "username",
        alias: "user",
        brief: "Update the username in the config file"
    }
];
