import { CommandoClient } from "discord.js-commando";
import path from "path";
import { config, getConnection } from "./config/index";

const bot: CommandoClient = new CommandoClient({
    commandPrefix: `${config.prefix} `,
    commandEditableDuration: 10,
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

bot.on("ready", async () => {
    try {
        await getConnection();
        console.log(`${bot.user?.username} is online!`);
    } catch (err) {
        console.log(`Error connecting to database:`);
        console.error(err);
    }
});

bot.login(config.token).catch(console.log);
