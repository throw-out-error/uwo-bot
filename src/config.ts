import * as cfg from "../config.json";
import Keyv from "keyv";
import path from "path";

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
export const database = new Keyv(
    dev
        ? path.join(__dirname, "/../../database.sqlite3")
        : `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${
              process.env.DB_HOST || "localhost"
          }:${process.env.DB_PORT || "27017"}/${
              process.env.DB_NAME || "uwo-bot"
          }`,
    { adapter: dev ? "sqlite" : "mongodb" },
);
