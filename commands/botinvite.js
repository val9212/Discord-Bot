const config = require("../config.js")

exports.run = (client, message) => {
    return message.channel.send(`Here is a link to invite the bot: ${config.BOT_INVITE}`);
};
