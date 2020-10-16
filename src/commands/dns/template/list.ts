import Api from "../../../api";
import { spinner } from "../../../utils/Utils";
import { Command, command, metadata } from "clime";
import { ColorRenderedStyledTable, border, single, color } from "styled-cli-table";

interface Template {
    index: string;
    template_id: string;
    template_name: string;
}

const api = new Api();

@command()
export default class extends Command {
    @metadata
    async execute(): Promise<void> {
        spinner.start();
        await api.init();

        api.newRequest();

        api.addParam("command", "dns_template_list");

        const templates: Template[] = [];
        const response = await api.send();

        let templateCount = 0;
        try {
            templateCount = parseInt(response.templatecount);
        } catch (e) {
            // ?
        }

        for (let i = 0; i < templateCount; i++) {
            templates.push({
                index: String(i),
                template_id: response[`template_id[${i}]`],
                template_name: response[`template_name[${i}]`]
            });
        }

        const data = [
            ["#", "id", "name"]
        ];

        for (const item of templates) {
            data.push([item.index, item.template_id, item.template_name]);
        }

        const table = new ColorRenderedStyledTable(data, {
            ...border(true),
            borderCharacters: single,
            paddingLeft: 1,
            paddingRight: 1,
            backgroundColor: color.brightWhite,
            rows: {
                0: {
                    align: "center",
                    color: color.brightCyan + color.bold
                }
            },
            columns: {
                0: {
                    align: "center",
                    color: color.brightCyan + color.bold
                },
                1: {
                    width: 40
                },
                [-1]: {
                    width: 30
                }
            }
        });

        console.log(table.toString());
    }
}
