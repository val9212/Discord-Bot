const { EmbedBuilder } = require("discord.js");

exports.run = (client, message, args) => {
  const embed = new EmbedBuilder()
    .setColor(0x00A2E8)
    .setTitle("🏆 Possible Awards")
    .addFields(
      { name: `:tada: - Reach level 25`, value: `+ 5,000 money`, inline: true },
      { name: `:medal: - Reach level 50`, value: `+ 10,000 money`, inline: true },
      { name: `:military_medal: - Reach level 75`, value: `+ 20,000 money`, inline: true },
      { name: `:trophy:`  , value: `Reach level 100 (max)`, inline: true },
      { name: '\u200B', value: '\u200B' }, // Blank field

      { name: `:first_place: - Reach #1 on the leaderboard`, value: `+5% winning chance`, inline: false },
      { name: `:moneybag:`, value: `Earn 10,000 in cash. +1% winning chance`, inline: true },
      { name: `:credit_card:`, value: `Earn 100,000 in cash. +3% winning chance`, inline: true },
      { name: '\u200B', value: '\u200B' }, // Blank field

      { name: `:spy::skin-tone-1:`, value: `Secret Award`, inline: true },
      { name: `:tophat: - Secret Award`, value: `+`, inline: true },
      { name: `:watch:`, value: `Secret Award`, inline: true },
      { name: `:tools:`, value: `Secret Award`, inline: true },
    );

  message.channel.send({ embeds: [embed] });
};

