import { MessageEmbed } from "discord.js";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { getGuild } from "../../config/database/util";
import { Guild } from "../../config/database/guild";

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
                    type: "string",
                    oneOf: ["get", "set"],
                },
                {
                    key: "setting",
                    prompt: "What setting would you like to retrieve/modify?",
                    type: "string",
                    oneOf: ["sgchannel", "all"],
                },
                {
                    key: "value",
                    prompt:
                        "What is the new value for this setting? (optional)",
                    type: "string",
                    default: "",
                },
            ],
        });
    }

    async run(
        msg: CommandoMessage,
        {
            action,
            setting,
            value: newValue,
        }: { action: string; setting: string; value?: string }
    ) {
        try {
            let settings = await getGuild(msg.guild);

            setting = setting.toLowerCase();
            action = action.toLowerCase();
            let value = "";

            switch (action) {
                case "set":
                    value = newValue || "";
                    if (value.trim() === "")
                        return msg.reply("Invalid setting value!");
                    switch (setting) {
                        case "sgchannel":
                            await Guild.update(
                                {
                                    guildId: msg.guild.id,
                                },
                                {
                                    suggestionChannels: value
                                        .split(",")
                                        .flatMap((v) =>
                                            this.client.guilds.cache
                                                .get(msg.guild.id)
                                                ?.channels.cache.array()
                                                .filter(
                                                    (x) =>
                                                        (v.startsWith("#")
                                                            ? v.replace("#", "")
                                                            : v) === x.name
                                                )
                                                .map((c) => c.id)
                                        ),
                                }
                            );
                            break;
                        default:
                            return msg.reply(
                                `Cannot set unknown setting ${setting}`
                            );
                    }
                case "get":
                    switch (setting) {
                        case "sgchannel":
                            value = `${settings!.suggestionChannels.join(" ")}`;
                            break;
                        case "all":
                            value = `\n${Object.entries(settings!)
                                .map((e) => `${e[0]}: ${e[1]}`)
                                .join(", \n")}`;
                            break;
                        default:
                            return msg.reply(
                                `Cannot get unknown setting ${setting}`
                            );
                    }
            }
            switch (action) {
                case "set":
                    return msg.reply(
                        `Succesfully modified setting ${setting} to value ${value}`
                    );
                case "get":
                    return msg.reply(
                        `Current value for ${setting}: ${value || "not set"}`
                    );
            }
            return msg.reply("Invalid arguments!");
        } catch (err) {
            return msg.reply(`Failed with error: ${err.message}`);
        }
    }
}
