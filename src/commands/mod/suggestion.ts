import { MessageEmbed } from "discord.js";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { Settings } from "../../config/database/settings";
import { isText } from "../../util";

export default class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "suggest",
            aliases: ["sg"],
            group: "mod",
            memberName: "suggest",
            description: "Kicks a member from the discord server.",
            argsType: "multiple",
            clientPermissions: ["ADD_REACTIONS", "EMBED_LINKS"],
        });
    }

    async run(msg: CommandoMessage, args: string[]) {
        if (!args.length) return msg.reply("Please give a valid suggestion!");

        const channelNames = (
            await Settings.findOne({
                where: { guildId: msg.guild.id },
            })
        )?.suggestionChannels;

        if (!channelNames)
            return msg.reply(
                "The server admin has not set up a suggestion channel!",
            );

        let channel = this.client.guilds.cache
            .get(msg.guild.id)
            ?.channels.cache.find((x) => channelNames.includes(x.name));

        if (!channel || !isText(channel))
            return msg.reply("The suggestion channel could not be found.");

        let embed: MessageEmbed = new MessageEmbed()
            .setTitle("Suggestion")
            .setAuthor(msg.author.username, msg.author.avatarURL()!)
            .setThumbnail(msg.author.avatarURL()!)
            .setColor("#ff2050")
            .setDescription(args.join(" "))
            .setTimestamp()
            .addFields([
                {
                    name: "User",
                    value: `${msg.author.tag}`,
                },
            ]);

        const res = await channel.send(embed);

        await res.react("✅");
        await res.react("❌");

        return res;
    }
}
