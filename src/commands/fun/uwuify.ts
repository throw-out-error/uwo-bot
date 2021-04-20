import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import Uwuifier from "uwuifier";

export default class UwuifyCommand extends Command {
    uwuifier: Uwuifier;
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "uwuify",
            aliases: ["owoify"],
            group: "fun",
            memberName: "uwuify",
            description: "uwuify's youw message",
        });
        this.uwuifier = new Uwuifier();
    }

    async run(msg: CommandoMessage, args: string) {
        const newMsg = await msg.channel.send(
            this.uwuifier.uwuifySentence(args)
        );
        await msg.delete();
        return newMsg;
    }
}
