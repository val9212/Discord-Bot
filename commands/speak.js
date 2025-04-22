const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
        if (message.author.id !== "352899523158474752") return message.channel.send("Only bot owners can use this command");
        const saywhat = args.join(" ")
        if (saywhat < 1) return message.channel.send("Didn't provide any text to say")
        message.delete (1);
        message.channel.send(saywhat)
}
