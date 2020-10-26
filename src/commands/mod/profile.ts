import {
    GuildMember,
    MessageEmbed,
    MessageEmbedOptions,
    User,
} from "discord.js";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { fetchProfile, getProfile } from "../../config/database/util";
import { getTarget } from "../../util";

export default class ProfileCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "profile",
            aliases: ["userinfo", "uinfo"],
            group: "mod",
            memberName: "profile",
            description: "shows you information about the user specified.",
            argsType: "multiple",
        });
    }

    async run(msg: CommandoMessage, args: string[]) {
        const u = getTarget(this.client, msg, args);
        const gm = msg.guild.members.cache.get(u.id)!;
        return msg.channel.send(
            new MessageEmbed(await fetchProfile(u, gm))
        );
    }
}
