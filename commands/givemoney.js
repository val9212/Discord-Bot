const { PermissionsBitField } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database("./assets/guildsettings.sqlite");


exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
    return message.channel.send("You need `MANAGE_GUILD` permission to use this command.");
  }

  const user = message.mentions.users.first();
  const amountArg = user ? args[1] : args[0];
  const amount = parseInt(amountArg, 10);

  if (isNaN(amount) || amount < 1) {
    return message.channel.send("Please provide a valid amount greater than 0.");
  }

  if (amount >= 999999) {
    return message.channel.send("The maximum amount to give is $999999.");
  }

  const targetUser = user || message.author;

  const row = db.prepare('SELECT * FROM profiles WHERE guildId = ? AND userId = ?').get(message.guild.id, targetUser.id);

  if (!row) {
    return message.channel.send(`${targetUser.username} needs to start talking first.`);
  }

  const totalMoney = row.cash + row.bank;

  if (totalMoney >= 999999) {
    return message.channel.send("Max money is $999999.");
  }

  const newCash = row.cash + amount;
  db.prepare('UPDATE profiles SET cash = ? WHERE guildId = ? AND userId = ?')
    .run(newCash, message.guild.id, targetUser.id);

  await message.channel.send(`✅ I have given $${amount} to **${targetUser.username}**.`);
};
