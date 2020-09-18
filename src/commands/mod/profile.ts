import {
    GuildMember,
    MessageEmbed,
    MessageEmbedOptions,
    User,
} from "discord.js";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { database } from "../../config";
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
            new MessageEmbed(await this.createProfile(u, gm)),
        );
    }

    async createProfile(
        user: User,
        gm: GuildMember,
    ): Promise<MessageEmbedOptions> {
        const profileData: object = (await database.get(
            `${user.id}.profile`,
        )) || {
            Bio: "Hello there.",
        };
        let fields: [string, any][] = Object.entries(profileData);

        // Remove Duplicates
        fields = fields.filter(
            (field, index, self) =>
                index === self.findIndex((t) => t[0] === field[0]),
        );
        return {
            title: `${user.username}'s Profile`,
            color: 0x33cc33,
            thumbnail: {
                url: user.avatarURL()!,
            },
            fields: [
                {
                    name: "Tag",
                    value: `${user.tag}`,
                },
                {
                    name: "Account Created",
                    inline: true,
                    value: `${user.createdAt.toLocaleDateString()} at ${user.createdAt.toLocaleTimeString()}`,
                },
                {
                    name: "Joined At",
                    inline: true,
                    value: `${gm.joinedAt?.toLocaleDateString()} at ${gm.joinedAt?.toLocaleTimeString()}`,
                },
                {
                    name: `Usew ID`,
                    value: `${user.id}`,
                    inline: true,
                },
                {
                    name: `Usew Status`,
                    value: `${user.presence.status}`,
                    inline: true,
                },
                ...fields.map((f) => ({
                    name: f[0],
                    value: f[1],
                })),
            ],
        };
    }
}
