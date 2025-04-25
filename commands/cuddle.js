const { EmbedBuilder } = require('discord.js');

exports.run = (client, message, args) => {
    const user = message.mentions.users.first();

    if (!user) return message.channel.send("you can't cuddle nobody");

    const embed = new EmbedBuilder()
        .setDescription(`${user} You got a cuddle from ${message.author.username} ❤`)
        .setImage("https://i.imgur.com/0yAIWbg.gif")
        .setColor(0xFF69B4);

    message.channel.send({ embeds: [embed] });
};
