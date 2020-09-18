import { GuildMember, MessageEmbedOptions, User } from "discord.js";
import { CommandoClient, Command, CommandMessage } from "discord.js-commando";

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

    async run(msg: CommandMessage, args: string[] | string) {
        const u = msg.author;
        const newProfile = {
            ...this.client.provider.get("global", `${u.id}.profile`),
        };
        const fieldData = msg.argString.split("--");
        if (fieldData.length < 2)
            return msg.channel.send(
                "Not enough arguments! Key and JSON value required. Use the help command for more information.",
            );
        newProfile[fieldData[0]] = fieldData[1];
        this.client.provider.set("global", `${u.id}.profile`, newProfile);
        return msg.channel.send("Updated your profile!");
    }
}
