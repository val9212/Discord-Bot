const { Client, EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database("./assets/guildsettings.sqlite");

const talkedRecently = new Set();

exports.run = (client, message, args) => {
  if (talkedRecently.has(message.author.id)) {
    return message.channel.send("You already hacked in the last 15 minutes. Please wait.");
  }

  try {
    const row = db.prepare(`SELECT * FROM profiles WHERE guildId = ? AND userId = ?`).get(message.guild.id, message.author.id);
    if (!row) return message.channel.send("You need to start talking first.");

    const dice = Math.floor(Math.random() * 1000 + 1);
    const dice2 = Math.floor(Math.random() * 3);
    const dice3 = Math.floor(Math.random() * 400 + 1);
    const possibleThingsToHack = ["the bank", "Mr. Robot", "a server", "the casino", "Ken's computer"];

    if (dice2 >= 2) {
      message.channel.send(`You were caught trying to hack ${possibleThingsToHack[Math.floor(Math.random() * possibleThingsToHack.length)]} and paid a fine of: $${dice3}`);
      db.prepare(`UPDATE profiles SET cash = ? WHERE guildId = ? AND userId = ?`).run(row.cash - dice3, message.guild.id, message.author.id);
    } else {
      db.prepare(`UPDATE profiles SET cash = ? WHERE guildId = ? AND userId = ?`).run(row.cash + dice, message.guild.id, message.author.id);
      message.channel.send(`You successfully hacked ${possibleThingsToHack[Math.floor(Math.random() * possibleThingsToHack.length)]} and earned $${dice}. You can hack again in 15 minutes.`);

      talkedRecently.add(message.author.id);
      setTimeout(() => {
        talkedRecently.delete(message.author.id);
      }, 15 * 60000);
    }

  } catch (error) {
    console.error(error);
    message.channel.send("An error occurred while processing the hack.");
  }
};
