const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database("./assets/guildsettings.sqlite");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
    return message.reply('You need `MANAGE_GUILD` permission to use this command.');
  }

  if (message.mentions.users.size < 1) {
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 1) {
      return message.reply('You didn\'t provide any valid XP amount to give.');
    }

    if (amount >= 9999999) {
      return message.reply('The maximum XP you can give is **9999999**.');
    }

    const row2 = db.prepare('SELECT * FROM profiles WHERE guildId = ? AND userId = ?').get(message.guild.id, message.author.id);
    if (!row2) {
      return message.reply('You need to start interacting in the server first.');
    }

    if (row2.xp >= 9999999) {
      return message.reply('You have reached the max XP limit of **9999999**.');
    }

    db.prepare('UPDATE profiles SET xp = ? WHERE guildId = ? AND userId = ?').run(row2.xp + amount, message.guild.id, message.author.id);

    return message.reply(`I have given **${amount}** XP to **${message.author.username}**.`);
  } else {
    const user = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (isNaN(amount) || amount < 1) {
      return message.reply('You didn\'t provide any valid XP amount to give.');
    }

    if (amount >= 9999999) {
      return message.reply('The maximum XP you can give is **9999999**.');
    }

    const row = db.prepare('SELECT * FROM profiles WHERE guildId = ? AND userId = ?').get(message.guild.id, user.id);
    if (!row) {
      return message.reply('This user needs to start interacting in the server first.');
    }

    if (row.xp >= 9999999) {
      return message.reply('This user has reached the max XP limit of **9999999**.');
    }

    db.prepare('UPDATE profiles SET xp = ? WHERE guildId = ? AND userId = ?').run(row.xp + amount, message.guild.id, user.id);

    return message.reply(`I have given **${amount}** XP to **${user.username}**.`);
  }
};
