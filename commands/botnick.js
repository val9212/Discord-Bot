const { EmbedBuilder } = require('discord.js');

exports.run = (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_NICKNAMES")) {
        return message.reply("You do not have permission to change the bot's nickname.");
    } else {
        let username = args.join(' ');
        if (username.length < 1) return message.reply('You must supply a name for the client.');

        const bot = message.guild.members.cache.get('618011652448845854');
        if (bot) {
            bot.setNickname(username)
                .then(() => {
                    const embed = new EmbedBuilder()
                        .setColor(0x00A2E8)
                        .addFields(
                            { name: "Bot username set successfully!", value: `${username} is now the nickname for the bot :white_check_mark:` }
                        );
                    message.reply({ embeds: [embed] });
                })
                .catch(err => {
                    console.error(err);
                    message.reply("There was an error trying to set the bot's nickname.");
                });
        } else {
            message.reply("Bot not found in the guild.");
        }
    }
};
