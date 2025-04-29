const { Client, EmbedBuilder } = require("discord.js");
const Database = require('better-sqlite3');
const db = new Database("./assets/guildsettings.sqlite");

exports.run = async (client, message, args) => {
  try {
    const row = db.prepare("SELECT * FROM scores WHERE guildId = ?").get(message.guild.id);
    if (!row) {
      return message.channel.send("No settings found for this guild.");
    }

    const prefixtouse = row.prefix;

    const usage = new EmbedBuilder()
      .setColor(0x00A2E8)
      .setThumbnail(client.user.avatarURL())
      .setTitle(`Command: ${prefixtouse}hackban`)
      .addFields(
        { name: "Usage", value: `${prefixtouse}hackban <ID> <reason>` },
        { name: "Example", value: `${prefixtouse}hackban 130515926117253122 self bot that dms server links and left.` },
        { name: "Description", value: "Bans a user without needing to be in the server" }
      );

    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.channel.send("You do not have permission to use this command.");
    }
    if (!message.guild.members.me.permissions.has("BAN_MEMBERS")) {
      return message.reply("I don't have the required permissions to ban members. :x:");
    }

    const user = args[0];
    if (isNaN(user)) return message.channel.send({ embeds: [usage] });

    let reason = args.slice(1).join(" ") || "Moderator didn't give a reason.";

    if (!user) return message.reply("You must provide a user ID.");
    if (user === message.author.id) return message.channel.send(":x: You cannot hackban yourself.");
    if (message.guild.members.cache.get(user)) {
      return message.channel.send(":x: That user is in the server. Please use the regular ban command.");
    }

    const modlog = message.guild.channels.cache.find(channel => channel.id === row.logschannel);

    message.guild.bans.create(user, { reason, days: 2 });
    db.prepare("UPDATE scores SET casenumber = ? WHERE guildId = ?").run(row.casenumber + 1, message.guild.id);

    const embed = new EmbedBuilder()
      .setColor(0x00A2E8)
      .setTitle(`Case #${row.casenumber} | Action: Hack Ban`)
      .addFields(
        { name: "Moderator", value: `${message.author.tag} (ID: ${message.author.id})` },
        { name: "User ID", value: user },
        { name: "Reason", value: reason, inline: true }
      )
      .setFooter({ text: `Time used: ${message.createdAt.toDateString()}` });

    message.channel.send(`ID: ${user}, has been banned from the server.`);

    if (modlog && row.logsenabled !== "disabled") {
      modlog.send({ embeds: [embed] });
    }

  } catch (error) {
    console.error("Error executing hackban command:", error);
    message.channel.send("An error occurred while processing the command.");
  }
};
