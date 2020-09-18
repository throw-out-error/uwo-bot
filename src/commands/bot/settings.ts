import { MessageEmbed } from "discord.js";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { database } from "../../config";

export default class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "settings",
            aliases: ["st"],
            group: "bot",
            memberName: "settings",
            description: "changes settings for the bot",
            userPermissions: ["ADMINISTRATOR"],
            argsType: "multiple",
        });
    }

    async run(msg: CommandoMessage, args: string[]) {
        if (!args.length) return msg.reply("Invalid setting.");
        try {
            switch (args[1].toLowerCase()) {
                case "schannel":
                    if (args[0].toLowerCase() === "set" && args.length >= 3) {
                        await database.set(
                            `settings.suggestions.channels.${msg.guild.id}`,
                            args[2],
                        );
                        return msg.reply(
                            `Succesfully recieved setting ${args[1]}`,
                        );
                    } else if (
                        args[0].toLowerCase() === "get" &&
                        args.length === 2
                    )
                        return msg.reply(
                            `Current value: ${await database.get(
                                `settings.suggestions.channels.${msg.guild.id}`,
                            )}`,
                        );
                    break;
            }
            return msg.reply("Invalid command.");
        } catch (err) {
            return msg.reply(`Failed with error: ${err.message}`);
        }
    }
}
