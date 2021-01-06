export type AuthType = "plain" | "md5";
export type ParsedData = Record<string, string>;
export type Query = Record<string, string>;

export interface Domain {
    index: string;
    domain: string;
    registrant: string;
    registrant_id: string;
    admin: string;
    admin_id: string;
    tech: string;
    tech_id: string;
    bill: string;
    bill_id: string;
    ns_id: string;
    dns_template: string;
    verloopdatum: string;
    inaccountdatum: string;
    status: string;
    autorenew: string;
}

export interface DNSRecord {
    index: string;
    record_id: string;
    type: string;
    host: string;
    address: string;
    priority: string;
    weight: string;
    port: string;
}

export interface Template {
    index: string;
    template_id: string;
    template_name: string;
}

export enum BorderStyle {
    Single = "single",
    Double = "double",
    Round = "round",
    Bold = "bold",
    SingleDouble = "singleDouble",
    DoubleSingle = "doubleSingle",
    Classic = "classic"
}
