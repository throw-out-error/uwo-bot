import { User } from "discord.js";
import { CommandoClient, Command, CommandMessage } from "discord.js-commando";

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
        const target: User | undefined =
            args[0] && args[0].length > 0
                ? this.client.users.find(
                      (user) =>
                          user.username === args[0].replace(/<@!?|>/g, "") ||
                          user.id === args[0].replace(/<@!?|>/g, "") ||
                          user.tag === args[0].replace(/<@!?|>/g, ""),
                  ) || msg.author
                : msg.author;
        if (!target) return msg.reply("Please specify someone to kick.");
        const gm = msg.guild.members.get(target.id);
        if (gm && gm.kickable) {
            gm.kick();
            return msg.reply(`${target.username} has been kicked.`);
        } else {
            return msg.reply(`I cannot kick that user!`);
        }
    }
}
