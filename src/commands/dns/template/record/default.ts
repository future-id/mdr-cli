import { SubcommandDefinition } from "clime";

export const subcommands: SubcommandDefinition[] = [
    {
        name: "add",
        alias: "new",
        brief: "Add a new record to the template"
    },
    {
        name: "remove",
        aliases: [
            "delete",
            "del",
            "rm"
        ],
        brief: "Delete an existing record from the template"
    }
];
