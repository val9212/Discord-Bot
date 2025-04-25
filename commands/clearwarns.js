const { PermissionsBitField } = require("discord.js");
const Database = require("better-sqlite3");
const db = new Database("./assets/guildsettings.sqlite");

exports.run = (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return message.reply("You don't have the `KICK_MEMBERS` permission. :x:");
    }

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
        return message.reply("I need the `KICK_MEMBERS` permission to run this command. :x:");
    }

    const user = message.mentions.users.first();
    if (!user) {
        return message.channel.send("You need to tag a user to check or remove their warnings.");
    }

    try {
        const row = db.prepare(`
            SELECT * FROM warnings 
            WHERE guildId = ? AND userId = ?
        `).get(message.guild.id, user.id);

        if (!row) {
            return message.channel.send(`${user.username} has 0 warning(s).`);
        }

        if (row.userwarnings === 0) {
            return message.channel.send(`${user.username} has 0 warning(s).`);
        }

        db.prepare(`
            DELETE FROM warnings 
            WHERE guildId = ? AND userId = ?
        `).run(message.guild.id, user.id);

        message.channel.send(`${user.username} had ${row.userwarnings - 1} warning(s) removed.`);

    } catch (err) {
        console.error(err);
        message.channel.send("An error occurred: " + err.message);
    }
};
