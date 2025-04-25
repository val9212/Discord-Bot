const { PermissionsBitField } = require('discord.js');

exports.run = (client, message, args) => {
    const coinflip = ['Heads!', 'Tails!'];
    message.channel.send(coinflip[Math.floor(Math.random() * coinflip.length)]);
};

