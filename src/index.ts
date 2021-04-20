import { CommandoClient } from "discord.js-commando";
import path from "path";
import { config, getDatabase } from "./config/index";

const bot: CommandoClient = new CommandoClient({
    commandPrefix: `${config.toObject().bot.prefix} `,
    commandEditableDuration: 10,
    invite: config.toObject().bot.supportServerInvite,
    owner: config.toObject().bot.owners,
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
});

bot.registry
    .registerGroups([
        ["bot", "Core bot commands"],
        ["mod", "Moderation commands"],
        ["fun", "Random commands for fun"],
    ])
    .registerDefaults();
bot.registry.unregisterCommand(bot.registry.findCommands("eval")[0]);
bot.registry.registerCommandsIn({
    filter: /^([^.].*)\.(js|ts)$/,
    dirname: path.join(__dirname, "commands"),
});

// .registerTypesIn(path.join(__dirname, "types"));

bot.on("ready", async () => {
    try {
        await getDatabase();
        console.log(`${bot.user?.username} is online!`);
    } catch (err) {
        console.log(`Error connecting to database:`);
        console.error(err);
    }
});

bot.login(config.toObject().bot.token).catch(console.log);
