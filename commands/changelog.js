const { Client, EmbedBuilder } = require("discord.js");

exports.run = (client, message, args) => {
    const embed = new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
        .setColor(0x00A2E8)
        .setTitle("Changelog v1.0.5")
        .addFields(
            { name: "Changes", value: "- UPDATE FOR DISCORDJS V14" }
        )
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() });

    message.channel.send({ embeds: [embed] });
};
