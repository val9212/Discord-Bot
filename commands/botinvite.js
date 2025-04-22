const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
return message.channel.send("here is a link to invite the bot: https://discordapp.com/oauth2/authorize?client_id=618011652448845854&permissions=8&scope=bot")
}
