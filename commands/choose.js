const { EmbedBuilder } = require('discord.js');

exports.run = (client, message, args) => {
    const choice1 = args[0];
    const choice2 = args.slice(1).join(" ");

    if (!choice1 || !choice2) {
        return message.channel.send("You need to provide two options to choose from.");
    }

    const choices = [choice1, choice2];
    const selected = choices[Math.floor(Math.random() * choices.length)];

    message.channel.send(`I choose **${selected}**!`);
};
