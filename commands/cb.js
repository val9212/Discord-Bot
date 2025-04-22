const Discord = require("discord.js");
const bot = new Discord.Client();
const Cleverbot = require('cleverio');
        const clevs = new Cleverbot({
            key: "KEY",
            user: "USERNAME",
            nick: "Mister UwU"
        });
exports.run = async (client, message, args) => {
    try {
        clevs.create();
        const text = args.join(" ")
        const { response } = await clevs.ask(text);
        message.channel.send(response);
    } catch (err) {
        console.log(err)
    }
}
   
