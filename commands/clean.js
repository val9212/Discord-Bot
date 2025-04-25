const { PermissionsBitField } = require('discord.js');

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
        return message.channel.send("Sorry, you do not have permission to perform the clean command.");
    }

    const num = parseInt(args[0]) || 99;

    try {
        const messages = await message.channel.messages.fetch({ limit: num });
        const botMessages = messages.filter(m => m.author.id === client.user.id);

        if (botMessages.size < 1) {
            return message.channel.send("**No messages found to clean**");
        }

        await message.channel.bulkDelete(botMessages, true);
        message.channel.send("**Mister UWU messages have been deleted**").then(msg => {
            setTimeout(() => msg.delete().catch(() => {}), 5000);
        });
    } catch (error) {
        console.error(error);
        message.channel.send("An error occurred while trying to delete messages.");
    }
};
