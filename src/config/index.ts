import * as cfg from "../../config.json";
import { createConnection, getConnection } from "typeorm";
import { Profile } from "./database/profile";
import { Settings } from "./database/settings";

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

export const dev = process.env.NODE_ENV === "development";

export const getDatabase = async () => {
    try {
        return getConnection();
    } catch {
        return await createConnection({
            type: "mongodb",
            url: `mongodb://${process.env.DB_USER || "root"}:${
                process.env.DB_PASS
            }@${process.env.DB_HOST || "localhost"}:${
                process.env.DB_PORT || "27017"
            }/${process.env.DB_NAME || "uwo-bot"}?authSource=admin`,
            entities: [Profile, Settings],
            logging: true,
            synchronize: true,
        });
    }
};
