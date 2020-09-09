import { GuildMember, RichEmbed, RichEmbedOptions, User } from "discord.js";
import { CommandoClient, Command, CommandMessage } from "discord.js-commando";

export default class ProfileCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "profile",
            aliases: ["userinfo", "uinfo"],
            group: "mod",
            memberName: "profile",
            description: "shows you information about the user specified.",
        });
    }

    async run(msg: CommandMessage, args: string[]) {
        if (typeof args === "string") args = [args];
        // console.log(args.map((v) => v.replace(/<@!?|>/g, "")));
        const u: User | undefined =
            args[0] && args[0].length > 0
                ? this.client.users.find(
                      (user) =>
                          user.username === args[0].replace(/<@!?|>/g, "") ||
                          user.id === args[0].replace(/<@!?|>/g, "") ||
                          user.tag === args[0].replace(/<@!?|>/g, ""),
                  ) || msg.author
                : msg.author;
        const gm = msg.guild.members.get(u.id)!;
        return msg.channel.send(new RichEmbed(this.createProfile(u, gm)));
    }

    createProfile(user: User, gm: GuildMember): RichEmbedOptions {
        const profileData: object = this.client.provider.get(
            "global",
            `${user.id}.profile`,
            {
                Bio: {
                    value: "Hello there.",
                },
            },
        );
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
                url: user.avatarURL,
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
                    value: `${gm.joinedAt.toLocaleDateString()} at ${gm.joinedAt.toLocaleTimeString()}`,
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
