import { SubcommandDefinition } from "clime";

export const subcommands: SubcommandDefinition[] = [
    {
        name: "apiPath",
        aliases: ["path", "api-path"],
        brief: "Update api path in the config file"
    },
    {
        name: "authType",
        aliases: ["auth", "auth-type"],
        brief: "Update auth type in the config file (plain or md5)"
    },
    {
        name: "host",
        brief: "Update host in the config file"
    },
    {
        name: "password",
        aliases: ["pwd", "pw", "pass", "passwd"],
        brief: "Update the password in the the config file"
    },
    {
        name: "ssl",
        brief: "Enable or disable ssl in the config file, when disabled auth type has to be md5"
    },
    {
        name: "username",
        alias: "user",
        brief: "Update username in the config file"
    }
];
