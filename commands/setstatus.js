const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
     if (message.author.id == "352899523158474752") {
            var argresult = args.join(' ');
            client.user.setStatus(argresult);
            message.reply("It has been set!");
        } else {
            message.reply("You do not have the permissions. Creator of the bot only. :x:");
        }
}
   
