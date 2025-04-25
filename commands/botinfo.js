const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const Database = require('better-sqlite3');
const db = new Database("./assets/guildsettings.sqlite");

const version = 'v14.0.0'

exports.run = (client, message) => {
    fs.readdir('./commands/', (err, files) => {
        const filez = files.length;
        if (err) return console.error(err);

        const row = db.prepare('SELECT * FROM scores WHERE guildId = ?').get(message.guild.id);
        if (!row) return;

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
            .setColor(0x00A2E8)
            .addFields(
                { name: 'Memory', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MBS`, inline: true },
                { name: 'Commands:', value: `${filez + 11}`, inline: true },
                { name: 'Total Users', value: `${client.users.cache.size}`, inline: true },
                { name: 'Total Channels:', value: `${client.channels.cache.size}`, inline: true },
                { name: 'Total Servers', value: `${Math.ceil(client.guilds.cache.size)}`, inline: true },
                { name: 'Bot Created', value: client.user.createdAt.toLocaleString() },
                { name: 'Library', value: `discord.js ${version}`, inline: true },
                { name: 'Node.js Version', value: process.version, inline: true },
                { name: 'Bot Version', value: '1.0.5', inline: true }
            )
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() });

        message.channel.send({ embeds: [embed] });
    });
};
