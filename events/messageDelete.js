const { EmbedBuilder, ChannelType } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database('./assets/guildsettings.sqlite');

module.exports = (client, message) => {
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (!message.guild.members.me.permissions.has(['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'])) return;

    const row = db.prepare(`SELECT * FROM scores WHERE guildId = ?`).get(message.guild.id);
    if (!row) return;

    if (row.slowmode === "enabled") return;

    const description = message.cleanContent;
    const descriptionfix = description.substr(0, 600);

    const guild = message.guild;
    const modlog = guild.channels.cache.find(c => c.id === row.logschannel && c.type === ChannelType.GuildText);
    if (!modlog) return;

    const embed = new EmbedBuilder()
        .setColor(0x00A2E8)
        .setThumbnail(message.author.displayAvatarURL())
        .addFields(
            { name: "Author", value: `${message.author.tag} (ID: ${message.author.id})`, inline: true },
            { name: "Message Content", value: `${descriptionfix}`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: `Message deleted in ${message.channel.name}` });

    modlog.send({ embeds: [embed] });
}


