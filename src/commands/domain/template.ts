import ApiCommand from "../../utils/ApiCommand";
import { logger, spinner } from "../../utils/Utils";
import { command, metadata, option, Options } from "clime";
import { Template } from "src/utils/Types";

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
        //== SECTION: GET TEMPLATE NAME FROM DOMAIN ==//
        if (!options.quiet) spinner.start();
        this.api.newRequest(options.quiet);
        this.api.addParam("command", "domain_get_details");

        if (options.full_domain) {
            const split = options.full_domain.split(".");
            const tld = split[split.length - 1];
            const domain = options.full_domain.replace(`.${tld}`, "");
            this.api.addParam("domein", domain);
            this.api.addParam("tld", tld);
        } else {
            this.api.addParam("domein", options.domain);
            this.api.addParam("tld", options.tld);
        }

        const details = await this.api.send();
        const templateName = details["dns_template"];

        //== SECTION: LIST TEMPLATES ==//
        if (!options.quiet) spinner.start();
        this.api.newRequest(options.quiet);
        this.api.addParam("command", "dns_template_list");
        const templates: Template[] = [];
        const dns = await this.api.send();

        let templateCount = 0;
        try {
            templateCount = parseInt(dns.templatecount);
        } catch (e) { }

        for (let i = 0; i < templateCount; i++) {
            templates.push({
                index: String(i + 1),
                id: dns[`template_id[${i}]`],
                name: dns[`template_name[${i}]`]
            });
        }

        //== SECTION: FIND TEMPLATE BY NAME ==//
        const template = templates.find((t) => t.name === templateName);
        if (!template) {
            if (options.quiet) logger.log(0);
            else logger.error("Template not found.");
            return;
        }

        // TODO: Same as record (selected proprety)
        logger.log(template.id);
    }
}
