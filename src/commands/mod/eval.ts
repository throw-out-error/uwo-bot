import {
    GuildMember,
    MessageEmbed,
    MessageEmbedOptions,
    User,
} from "discord.js";
import * as babel from "@babel/core";
import { CommandoClient, Command, CommandoMessage } from "discord.js-commando";
import { NodeVM } from "vm2";
import { config } from "../../config";
import { get } from "config";
export default class ProfileCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "eval",
            aliases: ["evaluate"],
            group: "mod",
            memberName: "eval",
            description: "runs code.",
            argsType: "single",
        });
    }

    async run(msg: CommandoMessage, args: string) {
        try {
            const u = msg.author;
            const gm = msg.guild.members.cache.get(u.id)!;
            const allowedModules = [
                "assert",
                "buffer",
                "crypto",
                "http",
                "https",
                "dns",
                "events",
                "net",
                "path",
                "querystring",
                "stream",
                "readline",
                "string_decoder",
                "timers",
                "url",
            ];
            // console.log(msg.author.id);
            if (msg.author.id in (get("Bot.owners") as string[]))
                allowedModules.push("child_process");
            const vm = new NodeVM({
                require: {
                    external: true,
                    builtin: allowedModules,
                },
                sandbox: {
                    _msg:
                        msg.author.id in (get("Bot.owners") as string[])
                            ? msg
                            : new Error("Access denied!"),
                },
                wrapper: "commonjs",
            });
            const sourceCode = `
                ${args}
            `;

            // Provide the transform options, in particular the typescript plugin.
            let options = {
                plugins: [
                    "dynamic-import-node",
                    "@babel/plugin-transform-typescript",
                ],
                presets: [
                    [
                        "@babel/preset-env",
                        {
                            targets: {
                                node: "current",
                            },
                            modules: "commonjs",
                        },
                    ],
                ],
            };

            // Run the babel transform with typescript plugin.
            let transformed = babel.transform(sourceCode, options);

            let result = vm.run(transformed.code, "test.js").default;
            if (typeof result === "function") result = result();
            else if (result instanceof Promise) result = await result;
            return msg.channel.send(
                typeof result === "string" ? result : JSON.stringify(result)
            );
        } catch (err) {
            return msg.channel.send(err.toString());
        }
    }
}
