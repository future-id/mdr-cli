import { SubcommandDefinition } from "clime";

export const subcommands: SubcommandDefinition[] = [
    {
        name: "template",
        alias: "temp",
        brief: "Create, add, list or modify dns template records"
    },
    {
        name: "details",
        alias: "info",
        brief: "Get dns details from a domain"
    },
    {
        name: "modify",
        aliases: [
            "mod",
            "edit"
        ],
        brief: "Modify dns records"
    }
];
