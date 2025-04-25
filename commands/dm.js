const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Database = require("better-sqlite3");
const db = new Database("./assets/guildsettings.sqlite");

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return message.channel.send(`Missing permissions to DM this user with the bot.`);
    }

    const row = db.prepare('SELECT * FROM scores WHERE guildId = ?').get(message.guild.id);
    if (!row) return message.channel.send("No settings found for this guild.");
    const prefixtouse = row.prefix;

    const usageEmbed = new EmbedBuilder()
        .setColor(0x00A2E8)
        .setThumbnail(client.user.avatarURL())
        .setTitle(`Command: ${prefixtouse}dm`)
        .addFields(
            { name: 'Usage', value: `${prefixtouse}dm @Someone <message>` },
            { name: 'Example', value: `${prefixtouse}dm @Dowin Hey can you help me with something?` },
            { name: 'Description', value: 'Bot DMs a user with your message.' }
        );

    const who = message.mentions.users.first();
    if (!who) return message.channel.send({ embeds: [usageEmbed] });
    if (message.author.id === who.id) return message.channel.send(':x: You cannot DM yourself.');

    const message2 = args.slice(1).join(' ');
    if (message2.length > 400) return message.channel.send({ embeds: [usageEmbed] });

    try {
        await who.send(`**Message from ${message.author.username}:** ${message2}`);
        message.channel.send(`Successfully sent message to ${who.username}.`);
    } catch (err) {
        console.error(err);
        message.channel.send(`Failed to send DM to ${who.username}.`);
    }
};
