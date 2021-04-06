import ApiCommand from "../../utils/ApiCommand";
import { logger, Regex, spinner } from "../../utils/Utils";
import { command, metadata, option, Options } from "clime";
import { DNSRecord } from "src/utils/Types";
import { ColorRenderedStyledTable, border, single, color } from "styled-cli-table";
import chalk from "chalk";

const allowedProps = ["id", "type", "host", "address", "priority", "weight", "port"];

class CmdOptions extends Options {
    @option({
        name: "full-domain",
        flag: "f",
        description: "Domain name + TLD",
        required: false
    })
    full_domain!: string;

    @option({
        name: "domain",
        flag: "d",
        description: "Domain name",
        required: false
    })
    domain!: string;

    @option({
        name: "tld",
        flag: "t",
        description: "TLD extension of the domain name",
        required: false
    })
    tld!: string;

    @option({
        name: "template-id",
        flag: "i",
        description: "Template ID",
        required: false
    })
    template_id!: string;

    @option({
        name: "type",
        flag: "r",
        description: "Record type A, AAAA, TXT, MX..... (ALL to show all record types)",
        required: true
    })
    type!: string;

    @option({
        name: "host",
        flag: "h",
        description: "Record host",
        required: false
    })
    host!: string;

    @option({
        name: "property",
        flag: "p",
        description: "Get a certain property e.g. id, type, host, address, priority, weight or port",
        required: false
    })
    property!: string;

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
        // At least one of these needs to be defined
        if (!options.template_id && !options.full_domain && !options.domain && !options.tld) {
            logger.error("At least one of template_id, full_domain or domain + tld needs to be defined.");
            return;
        }

        // If domain is defined tld needs to be defined and viceversa
        if ((options.domain && !options.tld) || (options.tld && !options.domain)) {
            logger.error("If domain is defined tld also needs to be defined and vice versa.");
            return;
        }

        if (!options.quiet) spinner.start();

        this.api.newRequest(options.quiet);

        // If template id is defined get template details else dns details
        if (options.template_id) {
            this.api.addParam("command", "dns_template_get_details");
            this.api.addParam("template_id", options.template_id);
        } else if (options.full_domain) { // TODO : Test (mdr domain record -f <domain.tld> -r ALL)
            if (!Regex.domain.test(options.full_domain)) {
                logger.error(`Invalid domain, valid patterns are ${chalk.bold("example.com")} and ${chalk.bold("example.co.uk")}`);
                return;
            }

            const split = options.full_domain.split(".");
            const tld = split[split.length - 1];
            const domain = options.full_domain.replace(`.${tld}`, "");
            this.api.addParam("command", "dns_get_details");
            this.api.addParam("domein", domain);
            this.api.addParam("tld", tld);
        } else {
            this.api.addParam("command", "dns_get_details");
            this.api.addParam("domein", options.domain);
            this.api.addParam("tld", options.tld);
        }

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

        // Filter records by type
        let filtered = options.type.toUpperCase() === "ALL"
            ? records
            : records.filter((record) => record.type === options.type.toUpperCase());

        // Filter records by host name
        if (options.host) {
            filtered = filtered.filter((record) => record.host === options.host);
        }

        if (filtered.length <= 0) {
            if (options.quiet) logger.log(0);
            else logger.error(`No record found with type: ${chalk.bold(options.type)} ${options.host ? `and host: ${chalk.bold(options.host)}` : ""}`.trim());
            return;
        }

        // If a property is given log it as plain text else show table of records
        if (options.property && allowedProps.includes(options.property)) {
            if (filtered.length > 1 && !options.quiet) {
                logger.warn("Multiple records found using these filters, only selected the first one in the list.");
            }
            logger.log(filtered[0][options.property]);
        } else {
            const data = [
                ["#", "id", "type", "host", "address", "priority", "weight", "port"]
            ];

            for (const record of filtered) {
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
}
