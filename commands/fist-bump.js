const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    if (message.mentions.users.size < 1) return message.channel.send("You can't fist-bump nobody.");

    const user = message.guild.members.cache.get(message.mentions.users.first().id);

    const embed = new EmbedBuilder()
        .setColor(0x00A2E8)
        .setDescription(`${user} You got a fist-bump from ${message.author.username} ❤`)
        .setImage('https://i.imgur.com/lO2xZHC.gif');

    message.channel.send({ embeds: [embed] });
};
