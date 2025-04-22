const { Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
    try {
        const response = await fetch('http://api.adviceslip.com/advice');
        const data = await response.json();
        message.channel.send(data.slip.advice);
    } catch (err) {
        message.channel.send(`An error occurred: \`${err.message}\`. Try again later!`);
    }
};