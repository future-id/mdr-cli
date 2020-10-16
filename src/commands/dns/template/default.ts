import { SubcommandDefinition } from "clime";

export const subcommands: SubcommandDefinition[] = [
    {
        name: "details",
        alias: "info",
        brief: "Get details about a specific dns template"
    },
    {
        name: "list",
        brief: "Get a list of all dns templates"
    },
    {
        name: "modify",
        alias: "mod",
        brief: "Modify dns template records"
    }
];
