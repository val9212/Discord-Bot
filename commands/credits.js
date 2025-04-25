const { Client, EmbedBuilder } = require("discord.js");

exports.run = (client, message, args) => {
  const embed = new EmbedBuilder()
    .setColor(0x00A2E8)
    .addFields(
      { name: "Developer", value: "val92, Difalixe#7991" },
      { name: "Special thanks too:", value: `SciTeCh#9693  \nkrilex#9854` }
    )
    .setTimestamp()
    .setFooter({ text: client.user.username, iconURL: client.user.avatarURL() });

  message.channel.send({ embeds: [embed] });
};
