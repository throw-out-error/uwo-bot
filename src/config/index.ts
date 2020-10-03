import * as cfg from "../../config.json";
import { createConnection, getConnection } from "typeorm";
import { Profile } from "./database/profile";
import { Settings } from "./database/settings";

export type Config = {
    prefix?: string;
    token: string;
    supportServerInvite: string;
    owners: string[];
    dbUri?: string;
};

const c = cfg as any;

export const config: Config = {
    prefix: c.prefix ?? process.env.PREFIX! ?? "uwo",
    token: c.token ?? process.env.TOKEN!,
    supportServerInvite:
        c.supportServerInvite ?? process.env.SUPPORT_SERVER_INVITE!,
    owners: c.owners ?? [],
    dbUri: c.dbUri ?? "mongodb://localhost/uwo-bot",
};

export const dev = process.env.NODE_ENV === "development";

export const getDatabase = async () => {
    try {
        return getConnection();
    } catch {
        return await createConnection({
            type: "mongodb",
            url: `${config.dbUri}?authSource=admin`,
            entities: [Profile, Settings],
            logging: true,
            synchronize: true,
        });
    }
};
