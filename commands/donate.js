const { EmbedBuilder } = require('discord.js');
const config = require("../config.js")

exports.run = async (client, message, args) => {
  const embed = new EmbedBuilder()
    .setThumbnail("http://logok.org/wp-content/uploads/2014/05/Paypal-logo-pp-2014.png")
    .setDescription("Thank you for considering donating, the bot’s funding costs not a lot of money, so any bit of money would help our Discord bot stay alive. Thank you and bot on!")
    .setColor(0x00A2E8)
    .addFields(
      { name: "Paypal Email", value: `${config.PAYPAL_EMAIL}` },
      { name: "Patreon", value: `${config.PATREON}` }
    );

  await message.channel.send({ embeds: [embed] });
};
