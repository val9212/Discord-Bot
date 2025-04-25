const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const Database = require('better-sqlite3');
const db = new Database("./assets/guildsettings.sqlite");

exports.run = async (client, message, args) => {
  const row = db.prepare("SELECT * FROM scores WHERE guildId = ?").get(message.guild.id);
  const prefix = row?.prefix || "!";
  const option = args[0];

  const usageEmbed = new EmbedBuilder()
    .setColor(0x00A2E8)
    .setThumbnail(client.user.displayAvatarURL())
    .setTitle(`Command: ${prefix}autorole`)
    .setDescription("Enables/disables auto role on join.")
    .addFields(
      { name: "Usage", value: `${prefix}autorole [enable/disable] [role id]` },
      { name: "Example", value: `${prefix}autorole enable Members` }
    );

  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
    return message.reply("You're missing the **MANAGE_GUILD** permission.");
  }

  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    return message.reply("I need the **MANAGE_ROLES** permission to execute this command.");
  }

  if (!option || !["enable", "disable"].includes(option)) {
    return message.channel.send({ embeds: [usageEmbed] });
  }

  if (option === "enable") {
    const roleName = args.slice(1).join(" ").replace(/[^\x00-\x7F]/g, "");

    if (!roleName) return message.channel.send({ embeds: [usageEmbed] });

    db.prepare("UPDATE scores SET autoroleenabled = 'enabled', roletogive = ?, casenumber = ? WHERE guildId = ?")
      .run(roleName, row.casenumber + 1, message.guild.id);
    
    const autoRole = message.member.guild.roles.cache.find(r => r.id === roleName);

    message.channel.send(`Members will now get the role **${autoRole.name}** when they join the guild.`);

    if (row.logsenabled !== "disabled") {
      const logChannel = message.guild.channels.cache.find(c => c.id === row.logschannel);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor(0x00A2E8)
          .setTitle(`Case #${row.casenumber} | Action: Auto Role Enabled`)
          .addFields(
            { name: "Moderator", value: `${message.author.tag} (ID: ${message.author.id})` },
            { name: "Role to give", value: roleName, inline: true }
          )
          .setFooter({ text: `Time used: ${message.createdAt.toDateString()}` });
        logChannel.send({ embeds: [logEmbed] });
      }
    }
  }

  if (option === "disable") {
    db.prepare("UPDATE scores SET autoroleenabled = 'disabled', casenumber = ? WHERE guildId = ?")
      .run(row.casenumber + 1, message.guild.id);

    message.channel.send("Auto role has been **disabled** for this guild.");

    if (row.logsenabled !== "disabled") {
      const logChannel = message.guild.channels.cache.find(c => c.id === row.logschannel);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor(0x00A2E8)
          .setTitle(`Case #${row.casenumber} | Action: Auto Role Disabled`)
          .addFields(
            { name: "Moderator", value: `${message.author.tag} (ID: ${message.author.id})` }
          )
          .setFooter({ text: `Time used: ${message.createdAt.toDateString()}` });
        logChannel.send({ embeds: [logEmbed] });
      }
    }
  }
};
