import Api from "../../../api";
import { spinner } from "../../../utils/Utils";
import { Command, command, metadata, option, Options } from "clime";
import { ColorRenderedStyledTable, border, single, color } from "styled-cli-table";

interface DnsRecord {
    index: string;
    record_id: string;
    type: string;
    host: string;
    address: string;
    priority: string;
    weight: string;
    port: string;
}

const api = new Api();

class CmdOptions extends Options {
    @option({
        name: "template-id",
        flag: "i",
        description: "Template ID",
        required: true
    })
    template_id!: string;
}

@command()
export default class extends Command {
    @metadata
    async execute(options: CmdOptions): Promise<void> {
        spinner.start();
        await api.init();

        api.newRequest();

        api.addParam("command", "dns_template_get_details");
        api.addParam("template_id", options.template_id);

        const records: DnsRecord[] = [];
        const response = await api.send();

        let recordCount = 0;
        try {
            recordCount = parseInt(response.recordcount);
        } catch (e) {
            // ?
        }

        for (let i = 0; i < recordCount; i++) {
            records.push({
                index: String(i),
                record_id: response[`record_id[${i}]`],
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
            data.push([record.index, record.record_id, record.type, record.host, record.address, record.priority || "-", record.weight || "-", record.port || "-"]);
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
