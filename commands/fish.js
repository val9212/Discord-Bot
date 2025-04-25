const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
    const fishes = [':fish:', ':tropical_fish:', ':blowfish:', ':boot:'];
    const fish = fishes[Math.floor(Math.random() * fishes.length)];

    const embed = new EmbedBuilder()
        .setColor(0x00A2E8)
        .setDescription(`:fishing_pole_and_fish: You went fishing and caught a ${fish}`);

    message.channel.send({ embeds: [embed] });
};
