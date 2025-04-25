const { EmbedBuilder } = require('discord.js');
const util = require('util');
const config = require("../config.js")

exports.run = async (client, message, args) => {
    if (message.author.id !== config.OWNER_ID) {
        return message.channel.send("Only the bot owner can use this command.");
    }

    const code = args.join(" ");
    if (!code) return message.channel.send("Please provide some code to evaluate.");

    if (code.includes("client.token")) {
        return message.channel.send("Nice try, but I won't reveal my token! 😶");
    }

    try {
        let evaled = eval(code);
        if (typeof evaled !== "string") {
            evaled = util.inspect(evaled, { depth: 0 });
        }

        const outputEmbed = new EmbedBuilder()
            .setColor(0x00A2E8)
            .addFields(
                { name: ":inbox_tray: Input", value: `\`\`\`js\n${code}\n\`\`\`` },
                { name: ":outbox_tray: Output", value: `\`\`\`js\n${clean(evaled)}\n\`\`\`` }
            );

        message.channel.send({ embeds: [outputEmbed] });

    } catch (err) {
        const errorEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .addFields(
                { name: ":inbox_tray: Input", value: `\`\`\`js\n${code}\n\`\`\`` },
                { name: ":x: Error", value: `\`\`\`js\n${clean(err.message)}\n\`\`\`` }
            );

        message.channel.send({ embeds: [errorEmbed] });
    }

    function clean(text) {
        if (typeof text === "string") {
            return text
                .replace(/`/g, "`\u200b")
                .replace(/@/g, "@\u200b")
                .replace(client.token, "[TOKEN REDACTED]");
        } else {
            return text;
        }
    }
};
