import { Profile } from "./profile";
import { GuildUser } from "./user";
import { Guild } from "./guild";
import {
    GuildMember,
    User,
    Guild as DiscordGuild,
    MessageEmbedOptions,
} from "discord.js";

export const getGuild = async (g: DiscordGuild) => {
    let existingGuild = await Guild.findOne({
        where: { guildId: g.id },
    });

    if (!existingGuild) {
        await Guild.insert({
            guildId: g.id,
            suggestionChannels: [],
            users: [],
        });

        existingGuild = await Guild.findOne({
            where: { guildId: g.id },
        });
    }
    return existingGuild;
};

export const getGuildUser = async (user: User, gm: GuildMember) => {
    let existingGuildUser = await GuildUser.findOne({
        userId: user.id,
    });

    if (!existingGuildUser) {
        await GuildUser.insert({
            userId: user.id,
            profiles: [],
            guild: await getGuild(gm.guild),
        });

        existingGuildUser = await GuildUser.findOne({
            userId: user.id,
        });
    }
    return existingGuildUser;
};

export const getProfile = async (user: User, gm: GuildMember) => {
    const gu = await getGuildUser(user, gm);

    let existingProfile = await Profile.findOne({
        where: { user: gu, main: true },
    });
    if (!existingProfile) {
        await Profile.insert({
            user: gu,
            main: true,
            fields: {
                Bio: "Hello world.",
            },
        });
        existingProfile = await Profile.findOne({
            where: { user: gu, },
        });
    }
    return existingProfile;
};

export const fetchProfile = async (
    user: User,
    gm: GuildMember,
    footer?: string
): Promise<MessageEmbedOptions> => {
    const profileData = await getProfile(user, gm);

    let fields: [string, any][] = Object.entries(profileData!.fields);

    // Remove Duplicates
    fields = fields.filter(
        (field, index, self) =>
            index === self.findIndex((t) => t[0] === field[0])
    );
    return {
        title: `${user.username}'s Profile`,
        color: 0x33cc33,
        footer: { text: footer },
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
};
