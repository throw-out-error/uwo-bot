import * as cfg from "../config.json";

export type Config = {
    prefix: string;
    token: string;
    supportServerInvite: string;
    owners: string[];
};

const c = cfg as any;

export const config: Config = {
    prefix: c.prefix || process.env.PREFIX!,
    token: c.token || process.env.TOKEN!,
    supportServerInvite:
        c.supportServerInvite || process.env.SUPPORT_SERVER_INVITE!,
    owners: c.owners || [],
};
