const { EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database('./assets/guildsettings.sqlite');

exports.run = async (client, message, args) => {
  try {
    const betAmount = parseInt(args[0], 10);
    const choice = args[1]?.toLowerCase();

    if (isNaN(betAmount) || betAmount <= 0 || (choice !== "heads" && choice !== "tails")) {
      return message.channel.send("Usage: `!flipcoin [bet amount] [heads/tails]`");
    }

    const getProfile = db.prepare('SELECT * FROM profiles WHERE guildId = ? AND userId = ?');
    const profile = getProfile.get(message.guild.id, message.author.id);

    if (!profile) {
      return message.channel.send("You don't have a profile yet.");
    }

    if (profile.cash < betAmount) {
      return message.channel.send("You don't have enough money to place that bet.");
    }

    const coinflip = Math.random() < 0.5 ? 'heads' : 'tails';
    const wonAmount = Math.round(betAmount * 1.25);

    let newCash = profile.cash;
    let resultText = '';
    let color = 'Red';

    if (coinflip === choice) {
      newCash += wonAmount;
      resultText = `🪙 The coin landed on **${coinflip}**!\nYou **won** $${wonAmount}! 🎉`;
      color = 'Green';
    } else {
      newCash -= betAmount;
      resultText = `🪙 The coin landed on **${coinflip}**!\nYou **lost** $${betAmount}. 😢`;
    }

    const updateProfile = db.prepare('UPDATE profiles SET cash = ? WHERE guildId = ? AND userId = ?');
    updateProfile.run(newCash, message.guild.id, message.author.id);

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle('Coin Flip')
      .setDescription(resultText)
      .addFields({ name: 'New Balance', value: `$${newCash}`, inline: true })
      .setTimestamp();

    await message.channel.send({
      content: `${message.author.username} flipped a coin!`,
      embeds: [embed]
    });

  } catch (error) {
    console.error(error);
    await message.channel.send("An error occurred while flipping the coin.");
  }
};
