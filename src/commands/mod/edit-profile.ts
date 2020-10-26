import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { fetchProfile, getProfile } from "../../config/database/util";
import { Profile } from "../../config/database/profile";
import { MessageEmbed } from "discord.js";

export default class ProfileCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "editprofile",
            aliases: ["eprofile", "editpr", "edpr"],
            group: "mod",
            memberName: "editprofile",
            description:
                "edits your profile information. When setting a value make sure to specify a json value such as a fields array. In the future there may be a simpler way to configure your profile.",
            argsType: "multiple",
        });
    }

    async run(msg: CommandoMessage, args: string[]) {
        const user = msg.author;
        const gm = msg.guild.members.cache.get(user.id)!;
        let profileData = await getProfile(user, gm);

        const fieldData = [...args.slice(0, 1), args.slice(1).join(" ")];
        if (fieldData.length < 2)
            return msg.reply(
                "Not enough arguments! Key and JSON value required. Use the help command for more information."
            );
        if (
            !fieldData[0] ||
            fieldData[0].trim() === "" ||
            !fieldData[1] ||
            fieldData[1].trim() === ""
        )
            return msg.reply(
                "Invalid key and value. Example: 'uwo edpr Bio Hello world.'"
            );
        profileData![fieldData[0]] = fieldData[1];
        await Profile.update(
            { user: profileData.user },
            {
                fields: {
                    ...profileData?.fields,
                    [fieldData[0]]: fieldData[1],
                },
            }
        );
        return msg.channel.send(
            new MessageEmbed(
                await fetchProfile(
                    user,
                    gm,
                    `Updated ${msg.author.username}'s ${fieldData[0]}.`
                )
            )
        );
    }
}
