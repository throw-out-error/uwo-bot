import { CommandoClient, SQLiteProvider } from "discord.js-commando";
import path from "path";
import sqlite from "sqlite";
import { config } from "./config";

const bot: CommandoClient = new CommandoClient({
    commandPrefix: config.prefix,
    commandEditableDuration: 10,
    disableEveryone: true,
    invite: config.supportServerInvite,
    owner: config.owners,
});

console.log(path.join(__dirname, "commands"));

bot.registry
    .registerGroups([
        ["bot", "Core bot commands"],
        ["mod", "Moderation commands"],
    ])
    .registerDefaults()
    .registerCommandsIn({
        filter: /^([^.].*)\.(js|ts)$/,
        dirname: path.join(__dirname, "commands"),
    });
// .registerTypesIn(path.join(__dirname, "types"));

sqlite
    .open(path.join(__dirname, "/../../database.sqlite3"))
    .then((database) => {
        bot.setProvider(new SQLiteProvider(database));
    })
    .catch((e) => {
        console.error(`Failed to connect to database: ${e}`);
    });

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online!`);
});

bot.login(config.token).catch(console.log);
