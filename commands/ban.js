const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const Database = require('better-sqlite3');
const db = new Database("./assets/guildsettings.sqlite");

exports.run = async (client, message, args) => {
  const row = db.prepare(`SELECT * FROM scores WHERE guildId = ?`).get(message.guild.id);
  const prefix = row?.prefix || "!";

  const usageEmbed = new EmbedBuilder()
    .setColor(0x00A2E8)
    .setThumbnail(client.user.displayAvatarURL())
    .setTitle(`Command: ${prefix}ban`)
    .setDescription("Bans a user from the current server")
    .addFields(
      { name: "Usage", value: `${prefix}ban @Someone <reason>` },
      { name: "Example", value: `${prefix}ban @Someone for ad links to other discords` }
    );

  if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    return message.reply("You're missing the `BAN_MEMBERS` permission.");
  }

  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
    return message.reply("I don't have permission to ban members.");
  }

  const target = message.mentions.members.first();
  if (!target) return message.channel.send({ embeds: [usageEmbed] });

  if (target.roles.highest.position >= message.member.roles.highest.position) {
    return message.reply("I can't ban that member. They have a higher or equal role.");
  }

  if (!target.bannable) {
    return message.reply("I can't ban that member. They might be above me in role hierarchy.");
  }

  const reason = args.slice(1).join(" ") || "Moderator didn't give a reason.";

  try {
    await target.ban({ reason });
    message.channel.send("✅ The user has been successfully banned.");

    // Mise à jour casenumber
    db.prepare(`UPDATE scores SET casenumber = ? WHERE guildId = ?`)
      .run(row.casenumber + 1, message.guild.id);

    const logChannel = message.guild.channels.cache.find(c => c.id === row.logschannel);
    if (logChannel && row.logsenabled !== "disabled") {
      const logEmbed = new EmbedBuilder()
        .setColor(0x00A2E8)
        .setTitle(`Case #${row.casenumber} | Action: Ban`)
        .addFields(
          { name: "Moderator", value: `${message.author.tag} (ID: ${message.author.id})` },
          { name: "User", value: `${target.user.tag} (ID: ${target.user.id})` },
          { name: "Reason", value: reason }
        )
        .setFooter({ text: `Time used: ${message.createdAt.toDateString()}` });

      logChannel.send({ embeds: [logEmbed] });
    }

  } catch (err) {
    console.error(err);
    message.reply(":x: An error occurred while trying to ban the user.");
  }
};
