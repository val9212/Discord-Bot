const { EmbedBuilder, Client, GatewayIntentBits } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database('./assets/guildsettings.sqlite');

exports.run = async (client, message, args) => {
  const row = db
    .prepare('SELECT * FROM profiles WHERE guildId = ? AND userId = ?')
    .get(message.guild.id, message.author.id);

  const usage = new EmbedBuilder()
    .setColor(0x00A2E8)
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
      { name: 'Usage:', value: '>25 <amount>' },
      { name: 'Example:', value: '>25 1000' }
    );

  if (!args[0]) return message.channel.send({ embeds: [usage] });

  const number = parseInt(args[0]);
  if (isNaN(number) || !isFinite(number)) return message.channel.send(`${args[0]} is not a valid number to bet.`);
  if (number < 1) return message.channel.send("You can't bet anything less than 1.");
  if (number.toString().length > 6) return message.channel.send("You can't bet more than 6 digits.");

  if (!row || row.cash < number)
    return message.channel.send(`You don't have enough money to bet that much. You have: $${row?.cash || 0}`);

  const dice = Math.floor(Math.random() * 49) + 1;
  const wonAmount = Math.round(number * 1.25);

  const embed = new EmbedBuilder()
    .setColor(0x00A2E8)
    .setTimestamp()
    .setThumbnail('http://www.pngall.com/wp-content/uploads/2016/04/Dice-Free-Download-PNG.png')
    .setTitle(`🎲 The dice has rolled: ${dice}`);

  if (dice >= 25) {
    db.prepare('UPDATE profiles SET cash = ? WHERE guildId = ? AND userId = ?')
      .run(row.cash + wonAmount, message.guild.id, message.author.id);
    embed.setDescription(`✅ You have won $${wonAmount}!`);
  } else {
    db.prepare('UPDATE profiles SET cash = ? WHERE guildId = ? AND userId = ?')
      .run(row.cash - number, message.guild.id, message.author.id);
    embed.setDescription(`❌ You have lost $${number}!`);
  }

  message.channel.send({ embeds: [embed] });
};