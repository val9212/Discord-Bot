const { PermissionsBitField } = require("discord.js");
const Database = require("better-sqlite3");
const db = new Database("./assets/guildsettings.sqlite");

exports.run = (client, message, args) => {
    let transferamount = parseInt(args[0]);

    if (transferamount <= 1) return message.channel.send("You can't deposit anything below 1");
    if (isNaN(transferamount)) return message.channel.send("Not a valid number to deposit");

    try {
        const row = db.prepare(`SELECT * FROM profiles WHERE guildId = ? AND userId = ?`).get(message.guild.id, message.author.id);

        if (!row) {
            return message.channel.send("You have no cash to deposit, need to start talking first.");
        }

        if (row.cash < transferamount) {
            return message.channel.send("You don't have enough money to deposit that much. You have: $" + row.cash);
        }

        const updateCash = db.prepare(`UPDATE profiles SET cash = ? WHERE guildId = ? AND userId = ?`);
        updateCash.run(row.cash - transferamount, message.guild.id, message.author.id);

        const updateBank = db.prepare(`UPDATE profiles SET bank = ? WHERE guildId = ? AND userId = ?`);
        updateBank.run(row.bank + transferamount, message.guild.id, message.author.id);

        message.channel.send(`I have successfully deposited $${transferamount} to your bank. New balance: $${row.cash - transferamount}.`);

    } catch (error) {
        console.error(error);
        message.channel.send(":x: Something went wrong while processing your deposit.");
    }
};
