import { RichEmbed } from "discord.js";
import { CommandoClient, Command, CommandMessage } from "discord.js-commando";

export default class InfoCommand extends Command {
    constructor(bot: CommandoClient) {
        super(bot, {
            name: "status",
            aliases: ["stats", "info"],
            group: "bot",
            memberName: "status",
            description: "shows you information about me.",
        });
    }

    async run(msg: CommandMessage, args: string[]) {
        const apiPing = Math.round(this.client.ping); // This will round the api ping of the client
        const responseTime = Math.round(Date.now() - msg.createdTimestamp); // This will round the response time between when the message was received and when the message was sent
        const elapUsage = process.cpuUsage();

        const elapUserMS = elapUsage.user / 1000; // microseconds to milliseconds
        const elapSystMS = elapUsage.system / 1000;
        const cpuPercent = (
            (100 * (elapUserMS + elapSystMS)) /
            1000000
        ).toFixed(1);

        return msg.channel.send(
            new RichEmbed({
                title: `uwo-bot status`,
                color: 0x33cc33,
                thumbnail: {
                    url: this.client.user.avatarURL,
                },
                fields: [
                    {
                        name: "My Nawme",
                        value: `${this.client.user.username}`,
                    },
                    {
                        name: "Sewvews I'm In",
                        inline: true,
                        value: `${this.client.guilds.size}`,
                    },
                    {
                        name: "Ping",
                        inline: true,
                        value: `${apiPing}`,
                    },
                    {
                        name: "Response Time",
                        inline: true,
                        value: `${responseTime} ms`,
                    },
                    {
                        name: "Memory Usage",
                        inline: true,
                        value: `${Math.round(
                            process.memoryUsage().heapUsed / 1000000,
                        )} MB`,
                    },
                    {
                        name: "CPU Usage",
                        inline: true,
                        value: `${cpuPercent}%`,
                    },
                ],
            }),
        );
    }
}
