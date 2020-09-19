import { MessageEmbed } from "discord.js";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { Settings } from "../../config/database/settings";

export default class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "settings",
            aliases: ["cs", "changesettings"],
            group: "bot",
            memberName: "settings",
            description:
                "changes settings for the bot that are also specific to the guild",
            userPermissions: ["ADMINISTRATOR"],
            args: [
                {
                    key: "action",
                    prompt: "What action would you like to run?",
                    default: "get",
                    type: "string",
                    oneOf: ["get", "set"],
                },
                {
                    key: "setting",
                    prompt: "What setting would you like to retrieve/modify?",
                    type: "string",
                    oneOf: ["sgchannel"],
                },
            ],
        });
    }

    async run(
        msg: CommandoMessage,
        { setting, action }: { setting: string; action: string },
    ) {
        try {
            if (!Settings.findOne({ guildId: msg.guild.id }))
                await Settings.insert({
                    guildId: msg.guild.id,
                    suggestionChannels: [],
                });
            setting = setting.toLowerCase();
            action = action.toLowerCase();
            switch (action) {
                case "get":
                    switch (setting) {
                        case "sgchannel":
                            await Settings.update(
                                {
                                    guildId: msg.guild.id,
                                },
                                {
                                    suggestionChannels: action.split(","),
                                },
                            );
                            return msg.reply(
                                `Succesfully modified setting ${setting}`,
                            );
                        default:
                            return msg.reply(
                                `Cannot set unknown setting ${setting}`,
                            );
                    }
                case "set":
                    switch (setting) {
                        case "sgchannel":
                            return msg.reply(
                                `Current value: ${(await Settings.findOne({
                                    guildId: msg.guild.id,
                                }))!.suggestionChannels.join(" ")}`,
                            );
                        default:
                            return msg.reply(
                                `Cannot get unknown setting ${setting}`,
                            );
                    }
            }
            return msg.reply("Invalid arguments. Valid arguments: set, get");
        } catch (err) {
            return msg.reply(`Failed with error: ${err.message}`);
        }
    }
}
