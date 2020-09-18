import { GuildMember, MessageEmbedOptions, User } from "discord.js";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { database } from "../../config";

export default class ProfileCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "editprofile",
            aliases: ["eprofile", "editpr", "edpr"],
            group: "mod",
            memberName: "editprofile",
            description:
                "edits your profile information. When setting a value make sure to specify a json value such as a fields array. In the future there may be a simpler way to configure your profile.",
        });
    }

    async run(msg: CommandoMessage, args: string) {
        const u = msg.author;
        const newProfile = (await database.get(`${u.id}.profile`)) || {
            Bio: "Hello there.",
        };
        const fieldData = args.split("--");
        if (fieldData.length < 2)
            return msg.channel.send(
                "Not enough arguments! Key and JSON value required. Use the help command for more information.",
            );
        newProfile[fieldData[0]] = fieldData[1];
        await database.set(`${u.id}.profile`, newProfile);
        return msg.channel.send("Updated your profile!");
    }
}
