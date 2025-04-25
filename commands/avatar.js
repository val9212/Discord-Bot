const { EmbedBuilder } = require("discord.js");

exports.run = (client, message, args) => {
  const user = message.mentions.users.first() || message.author;
  const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 });

  const embed = new EmbedBuilder()
    .setImage(avatarUrl)
    .setColor(0x00A2E8);

  message.channel.send({ embeds: [embed] });
};

