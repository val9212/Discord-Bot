const { EmbedBuilder } = require('discord.js');
const { exec } = require('child_process');
const config = require("../config.js")


exports.run = async (client, message, args) => {
    if (message.author.id !== config.OWNER_ID) {
        return message.channel.send("Only the bot owner can use this command.");
    }

    const code = args.join(' ');
    if (!code) return message.channel.send("You provided no input, are you sure you're not just trolling?");

    exec(code, (error, stdout, stderr) => {
        const input = `\`\`\`Bash\n${code}\n\`\`\``;

        if (error) {
            const errorOutput = `\`\`\`Bash\n${error.message}\n\`\`\``;
            const errorEmbed = new EmbedBuilder()
                .setTitle("Execution Error")
                .addFields(
                    { name: ":inbox_tray: Input", value: input },
                    { name: ":x: Error", value: errorOutput }
                )
                .setColor(0xFF0000);

            return message.channel.send({ embeds: [errorEmbed] });
        }

        const output = stderr || stdout;
        const outputEmbed = new EmbedBuilder()
            .setTitle("Execution Result")
            .addFields(
                { name: ":inbox_tray: Input", value: input },
                { name: ":outbox_tray: Output", value: `\`\`\`Bash\n${output}\n\`\`\`` }
            )
            .setColor(0x00A2E8);

        message.channel.send({ embeds: [outputEmbed] });
    });
};
