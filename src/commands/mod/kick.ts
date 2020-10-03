import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { getTarget } from "../../util";

export default class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "kick",
            userPermissions: ["KICK_MEMBERS"],
            clientPermissions: ["KICK_MEMBERS"],
            aliases: [],
            group: "mod",
            memberName: "kick",
            description: "Kicks a member from the discord server.",
            argsType: "multiple",
        });
    }

    async run(msg: CommandoMessage, args: string[]) {
        const author = msg.guild.members.cache.get(msg.author.id);

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
