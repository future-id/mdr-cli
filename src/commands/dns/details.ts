import ApiCommand from "../../utils/ApiCommand";
import { DNSRecord } from "../../utils/Types";
import { spinner } from "../../utils/Utils";
import { Options, command, option, metadata } from "clime";
import { ColorRenderedStyledTable, border, single, color } from "styled-cli-table";

class CmdOptions extends Options {
    @option({
        name: "domain",
        flag: "d",
        description: "Domain name",
        required: true
    })
    domain!: string;

    @option({
        name: "tld",
        flag: "t",
        description: "TLD extension of the domain name",
        required: true
    })
    tld!: string;
}

@command()
export default class extends ApiCommand {
    @metadata
    async execute(options: CmdOptions): Promise<void> {
        spinner.start();

        this.api.newRequest();

        this.api.addParam("command", "dns_get_details");
        this.api.addParam("domein", options.domain);
        this.api.addParam("tld", options.tld);

        const records: DNSRecord[] = [];
        const response = await this.api.send();

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
