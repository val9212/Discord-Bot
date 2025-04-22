const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
        if (message.author.id !== "352899523158474752") return message.channel.send("Only bot owners can use this command");
        if (!message.guild) {
        const getGuild = this.client.guilds.get(args.guild)
        const toInv = getGuild.channels.first()

        const invite = toInv.createInvite({
            maxAge: 120,
            maxUses: 1
        }).then(message.channel.send(`✅ | I\'ve sent the invite link to your DMs \n${invite}!`)
        ).catch(console.error),

}};

