const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
    const embed = new Discord.RichEmbed()
        .addField("Can upvote the bot at: ", "https://discordbots.org/bot/618011652448845854/vote")
      message.channel.send(embed)
}
