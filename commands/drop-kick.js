const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
  const user = message.mentions.users.first();
  if (!user) return message.channel.send("You can't drop kick nobody");

  const embed = new EmbedBuilder()
    .setImage("https://vgy.me/04YbOf.gif");

  await message.channel.send({
    content: `${user} You got a drop kick from ${message.author.username}`,
    embeds: [embed]
  });
};
