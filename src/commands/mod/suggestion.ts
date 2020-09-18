import { MessageEmbed, User } from "discord.js";
import { CommandoClient, Command, CommandMessage } from "discord.js-commando";
import { getTarget } from "../../util";

export default class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "suggest",
            aliases: ["sg"],
            group: "mod",
            memberName: "suggest",
            description: "Kicks a member from the discord server.",
            argsType: "multiple",
        });
    }

    async run(msg: CommandMessage, args: string[]) {
        if (!args.length) return msg.reply("Please give a valid suggestion!");

        let channel = msg.guild.channels.cache.find(
            (x) =>
                x.name === "suggestion" || setImmediate.name === "suggestions",
        );

        if (!channel)
            return msg.reply("There is no channel with name: suggestions");

        let embed: MessageEmbed = new MessageEmbed()
            .setAuthor(`SUGGESTION: ${msg.author.tag}`, msg.author.avatarURL()!)
            .setThumbnail(msg.author.avatarURL()!)
            .setColor("#ff2050")
            .setDescription(args.join(" "))
            .setTimestamp();

        const res = await msg.channel.send(embed);

        msg.react("756309736563146893");
        msg.react("756309875755188354");

        return res;
    }
}
