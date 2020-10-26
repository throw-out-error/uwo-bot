import { ConnectionOptions, createConnection, getConnection } from "typeorm";
import { Profile } from "./database/profile";
import { GuildUser } from "./database/user";
import { Guild } from "./database/guild";
import { get, has } from "config";

export type Config = {
    token: string;
    db: ConnectionOptions;
    owners?: string[];
    prefix?: string;
    supportServerInvite?: string;
};

export const config: Config = {
    prefix: has("Bot.prefix") ? get("Bot.prefix") : "uwo",
    token: get("Bot.token"),
    supportServerInvite: has("Bot.supportServerInvite")
        ? get("Bot.supportServerInvite")
        : "",
    owners: has("Bot.owners") ? get("Bot.owners") : [],
    db: get("Bot.db") as ConnectionOptions,
};

export const dev = process.env.NODE_ENV === "development";

export const getDatabase = async () => {
    try {
        return getConnection();
    } catch {
        return await createConnection({
            ...config.db,
            entities: [Profile, GuildUser, Guild],
            logging: true,
            synchronize: true,
        });
    }
};
