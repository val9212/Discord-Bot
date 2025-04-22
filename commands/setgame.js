const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = async (client, message, args) => {
   if (message.author.id == "352899523158474752") {
    var gametoset = args.join(' ');
    if (!gametoset) gametoset = null;
    client.user.setGame(gametoset);
    message.reply("The new game has been set!");
    } else {
      message.reply("You do not have the substancial permissions. Creator of the bot only. :x:");
    }
}
