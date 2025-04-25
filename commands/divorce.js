const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    if (message.mentions.users.size < 1) {
        return message.channel.send("You can't divorce nobody.");
    }

    let user = message.guild.members.cache.get(message.mentions.users.first().id);

    const embed = new EmbedBuilder()
        .setDescription(`${user} You got divorced with ${message.author.username} :broken_heart:`)
        .setImage("https://i.imgur.com/IgvLWaa.gif");

    message.channel.send({ embeds: [embed] });
};
