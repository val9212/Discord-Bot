const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database("./assets/guildsettings.sqlite");

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
    return message.channel.send("You're missing MANAGE_GUILD permission.");
  }

  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return message.reply("I need the MANAGE_MESSAGES permission to run this command. :x:");
  }

  const row = db.prepare('SELECT * FROM scores WHERE guildId = ?').get(message.guild.id);
  const prefix = row?.prefix || "!";

  const embedHelp = new EmbedBuilder()
    .setColor(0x00A2E8)
    .setThumbnail(client.user.displayAvatarURL())
    .setTitle(`Command: ${prefix}automod`)
    .setDescription("Enables/disables the bot's auto moderation.")
    .addFields(
      { name: "Usage", value: `${prefix}automod [enable/disable] [antiinvite/antiweblink/antidupcharacters/all]` },
      { name: "Example", value: `${prefix}automod enable antiinvite` }
    );

  const action = args[0];
  const option = args[1];

  if (!["enable", "disable"].includes(action) || !option) {
    return message.channel.send({ embeds: [embedHelp] });
  }

  const settingsMap = {
    antiinvite: "invitelinkprotection",
    antiweblink: "websitelinkprotection",
    antidupcharacters: "dupcharactersprotection"
  };

  const updateSettings = (enableAll, disableAll, toolName) => {
    const fields = {
      automoderation: enableAll ? "enabled" : disableAll ? "disabled" : "enabled",
      casenumber: row.casenumber + 1
    };

    if (option === "all") {
      fields.invitelinkprotection = enableAll ? "enabled" : "disabled";
      fields.websitelinkprotection = enableAll ? "enabled" : "disabled";
      fields.dupcharactersprotection = enableAll ? "enabled" : "disabled";
    } else {
      const key = settingsMap[option];
      if (key) fields[key] = enableAll ? "enabled" : "disabled";
      else return message.channel.send({ embeds: [embedHelp] });
    }

    const query = `
      UPDATE scores
      SET ${Object.keys(fields).map(k => `${k} = @${k}`).join(', ')}
      WHERE guildId = @guildId
    `;
    db.prepare(query).run({ ...fields, guildId: message.guild.id });

    message.channel.send(`Auto moderation ${enableAll ? "enabled" : "disabled"} for ${option}.`);

    const logChannel = message.guild.channels.cache.find(ch => c.id === row.logschannel);
    if (logChannel && row.logsenabled !== "disabled") {
      const embedLog = new EmbedBuilder()
        .setColor(0x00A2E8)
        .setTitle(`Case #${row.casenumber + 1} | Action: Auto Mod ${enableAll ? "Enabled" : "Disabled"}`)
        .addFields(
          { name: "Moderator", value: `${message.author.tag} (ID: ${message.author.id})` },
          { name: "Auto Mod Tool", value: option === "all" ? "All" : toolName },
          { name: "Time", value: new Date().toDateString() }
        );
      logChannel.send({ embeds: [embedLog] });
    }
  };

  const actionMap = {
    enable: () => updateSettings(true, false, option),
    disable: () => updateSettings(false, true, option)
  };

  actionMap[action]();
};
