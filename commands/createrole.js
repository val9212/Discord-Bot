const { Client, PermissionsBitField, EmbedBuilder } = require('discord.js');
const Database = require("better-sqlite3");
const db = new Database("./assets/guildsettings.sqlite");

exports.run = async (client, message, args) => {
    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return message.reply('Sorry, I don\'t have the `MANAGE_ROLES` permission to run this command. :x:');
    }

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return message.reply('You need the `MANAGE_ROLES` permission to use this command. :x:');
    }

    try {
        const row = db.prepare(`SELECT * FROM scores WHERE guildId = ?`).get(message.guild.id);
        const prefixtouse = row.prefix;

        const usage = new EmbedBuilder()
            .setColor(0x00A2E8)
            .setThumbnail(client.user.avatarURL())
            .setTitle(`Command: ${prefixtouse}createrole`)
            .addFields(
                { name: "Usage", value: `${prefixtouse}createrole <rolename> <rolecolor>` },
                { name: "Example", value: `${prefixtouse}createrole Mods 0x0F01A0` }
            )
            .setDescription("Creates a new role in the current server");

        let rolename = args[0];
        let color2 = args[1] || 'FFFFFF'; 
        let reason = args[2] || 'Moderator didn\'t give a reason.';

        if (!rolename || !color2) {
            return message.channel.send({ embeds: [usage] });
        }

        const guild = message.guild;
        const newRole = await guild.roles.create({
            name: rolename,
            color: color2
        });

        console.log(`${rolename} | ${color2} was created`);

        message.reply(`I have created the role: **${rolename}** with the color: **${color2}**`);

        const update = db.prepare(`UPDATE scores SET casenumber = ? WHERE guildId = ?`);
        update.run(row.casenumber + 1, message.guild.id);

        let modlog = message.guild.channels.cache.find(c => c.id === row.logschannel);
        const embed = new EmbedBuilder()
            .setColor(0x00A2E8)
            .setTitle(`Case #${row.casenumber + 1} | Action: Created Role`)
            .addFields(
                { name: "Moderator", value: `${message.author.tag} (ID: ${message.author.id})` },
                { name: "Role", value: `${rolename} (ID: ${newRole.id})` },
                { name: "In channel", value: message.channel.name, inline: true },
                { name: "Reason", value: reason, inline: true }
            )
            .setFooter({ text: `Time used: ${message.createdAt.toDateString()}` });

        if (modlog && row.logsenabled !== 'disabled') {
            modlog.send({ embeds: [embed] });
        }

    } catch (error) {
        console.error(error);
        message.reply('An error occurred while processing your request. Please try again later. :x:');
    }
};
