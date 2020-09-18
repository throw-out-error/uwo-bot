import { User } from "discord.js";
import { CommandoClient, Command, CommandMessage } from "discord.js-commando";
import { getTarget } from "../../util";

export default class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "kick",
            aliases: [],
            group: "mod",
            memberName: "kick",
            description: "Kicks a member from the discord server.",
            argsType: "multiple",
        });
    }

    async run(msg: CommandMessage, args: string[]) {
        const author = msg.guild.members.cache.get(msg.author.id);
        if (!author?.hasPermission("KICK_MEMBERS"))
            return msg.reply("You don't have permission to kick users.");

        const target = getTarget(this.client, msg, args);
        if (!target) return msg.reply("Please specify a target.");
        const gm = msg.guild.members.cache.get(target.id);
        if (gm && gm.kickable) {
            gm.kick();
            return msg.reply(`${target.username} has been kicked.`);
        } else {
            return msg.reply(`I cannot kick that user!`);
        }
    }
}
