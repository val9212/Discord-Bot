const { Client, PermissionsBitField } = require("discord.js");
const Cleverbot = require('cleverio');
const config = require('../config.js')
const clevs = new Cleverbot({
    key: config.CLEVERBOT_KEY,  
    user: config.CLEVERBOT_USER,  
    nick: config.CLEVERBOT_NICK
});

clevs.create();

exports.run = async (client, message, args) => {
    try {
        if (args.length < 1) {
            return message.channel.send("Please provide some text for me to respond to! :thinking:");
        }

        const text = args.join(" ");
        const { response } = await clevs.ask(text);

        message.channel.send(response);
    } catch (err) {
        console.log(err);
        message.channel.send("Oops! Something went wrong while trying to talk to Cleverbot. Please try again later.");
    }
};

