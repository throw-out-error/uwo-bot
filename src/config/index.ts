import { ConnectionOptions, createConnection, getConnection } from "typeorm";
import { Profile } from "./database/profile";
import { GuildUser } from "./database/user";
import { Guild } from "./database/guild";
import * as z from "zod";
import { readFile, WriteConfig } from "@theoparis/config";

export const dev = process.env.NODE_ENV === "development";

export const configSchema = z.object({
    bot: z.object({
        token: z.string(),
        prefix: z.string().default("uwo"),
        supportServerInvite: z.string().optional(),
        owners: z.array(z.string()).default([]),
    }),
    database: z.object({
        uri: z.string(),
    }),
});

export type Config = z.infer<typeof configSchema>;

export const config: WriteConfig<Config> = readFile<Config>(
    `${process.cwd()}/config/${process.env.NODE_ENV}.yml`,
    { type: "yaml", schema: configSchema }
).validate(true);

export const getDatabase = async () => {
    try {
        return getConnection();
    } catch {
        return await createConnection({
            type: "postgres",
            url: config.toObject().database.uri,
            entities: [Profile, GuildUser, Guild],
            logging: true,
            synchronize: true,
        });
    }
};
