import ApiCommand from "../../../utils/ApiCommand";
import { DNSRecord } from "../../../utils/Types";
import { spinner } from "../../../utils/Utils";
import { command, metadata, option, Options } from "clime";
import { ColorRenderedStyledTable, border, single, color } from "styled-cli-table";

class CmdOptions extends Options {
    @option({
        name: "template-id",
        flag: "i",
        description: "Template ID",
        required: true
    })
    template_id!: string;

    @option({
        name: "quiet",
        flag: "q",
        description: "Disables the loading indicator",
        required: false,
        toggle: true,
        default: false
    })
    quiet!: boolean;
}

@command()
export default class extends ApiCommand {
    @metadata
    async execute(options: CmdOptions): Promise<void> {
        if (!options.quiet) spinner.start();

        this.api.newRequest(options.quiet);

        this.api.addParam("command", "dns_template_get_details");
        this.api.addParam("template_id", options.template_id);

        const records: DNSRecord[] = [];
        const response = await this.api.send();

        let recordCount = 0;
        try {
            recordCount = parseInt(response.recordcount);
        } catch (e) { }

        for (let i = 0; i < recordCount; i++) {
            records.push({
                index: String(i + 1),
                id: response[`record_id[${i}]`],
                type: response[`type[${i}]`],
                host: response[`host[${i}]`],
                address: response[`address[${i}]`],
                priority: response[`priority[${i}]`],
                weight: response[`weight[${i}]`],
                port: response[`port[${i}]`]
            });
        }

        const data = [
            ["#", "id", "type", "host", "address", "priority", "weight", "port"]
        ];

        for (const record of records) {
            data.push([
                record.index,
                record.id,
                record.type,
                record.host,
                record.address,
                record.priority || "-",
                record.weight || "-",
                record.port || "-"
            ]);
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
                }
            }
        });

        console.log(table.toString());
    }
}
