import { SubcommandDefinition } from "clime";

export const subcommands: SubcommandDefinition[] = [
    {
        name: "details",
        alias: "info",
        brief: "Get details about a specific dns template"
    },
    {
        name: "list",
        alias: "ls",
        brief: "Get a list of all dns templates"
    },
    {
        name: "modify",
        aliases: [
            "mod",
            "edit"
        ],
        brief: "Modify dns template records"
    }
];
