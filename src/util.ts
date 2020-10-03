import { Channel, TextChannel, User } from "discord.js";
import { CommandoClient, CommandoMessage } from "discord.js-commando";

export const getTarget = (
    client: CommandoClient,
    msg: CommandoMessage,
    args: string[],
): User => {
    const target: User =
        args[0] && args[0].length > 0
            ? client.users.find(
                  (user) =>
                      user.username === args[0].replace(/<@!?|>/g, "") ||
                      user.id === args[0].replace(/<@!?|>/g, "") ||
                      user.tag === args[0].replace(/<@!?|>/g, ""),
              ) || msg.author
            : msg.author;
    return target;
};

export const isText = (channel: Channel): channel is TextChannel =>
    channel.type === "text";
