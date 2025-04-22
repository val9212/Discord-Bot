const { Client, GatewayIntentBits, ChannelType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = new Client({	intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.GuildPresences
],
partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database("./assets/guildsettings.sqlite");
const invitecheck = ["discord.gg", "discord.me", "discord.io/", "discordapp.com/invite"]
const weblinkcheck = ["http", "www.", ".com", "fr", ".net", ".org", ".ca", ".co.uk", ".fr"]

const config = require("./assets/jsons/config.json");

client.on('warn', err => console.warn('[WARNING]', err));

client.on('error', err => console.error('[ERROR]', err));

client.on('uncaughtException', (err) => {
    console.log("Uncaught Exception: " + err)
    process.exit(1)
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('[FATAL] Possibly Unhandled Rejection at: Promise ', promise, ' reason: ', reason.message);
});

client.on('disconnect', () => {
  console.warn('Disconnected!')
  process.exit(0);
})

client.on('reconnecting', () => console.warn('Reconnecting...'))

const talkedRecently = new Set();

const talkedRecently2 = new Set();


var cooldownUsers = [];

const checkCooldown = ((userId) => {
  if(cooldownUsers.indexOf(userId) > -1) {
    return true;
  } else {
    return false;
  }
});

const removeCooldown = ((userId, timeInSeconds) => {
  let index = cooldownUsers.indexOf(userId);
  if(index > -1) { 
    setTimeout(() => {
      cooldownUsers = cooldownUsers.splice(index, 0);
    }, timeInSeconds * 1000)
  }
});

fs.readdir('./events', (err, files) => {
  if (err) {
    console.error('Erreur lors de la lecture du répertoire des événements:', err);
    return;
  }

  files.forEach((file) => {
    if (file.endsWith('.js')) {
      const event = require(`./events/${file}`);
      const eventName = file.split('.')[0];
      client.on(eventName, event.bind(null, client));
    }
  });
});

client.on("guildCreate", async (guild) => {
  try {
  console.log(`Someone added Mister UwU to their discord! ${guild.name} Member count: ${guild.memberCount} owned by: ${guild.owner.user.username}!`)
  const owner = guild.owner.user
  var guildMsg = [
      "Thanks for adding me to your server. Just a few tips to get you started..",
      "```**1.** UwU default prefix is `>`.",
      "**2.** Commands will not work in direct messages.",
      "**3.** Set welcome leave messages with >welcomeleave.",
      "**4.** Set logs channel with >logs [channel name].",
      "**5.** Set autorole with >autorole [role name].",
      "**6.** Prefix can be changed with >prefix [new prefix].",
      "**7.** Profile System can be enabled with >profilesystem.",
      "**8.** Automod can be enabled with >automod enable all```"
  ]
  owner.send(guildMsg)
} catch (err) {
  return;
}
});

client.on('guildDelete', (guild) => {
  console.log(`Someone removed UwU from their discord! ${guild.name} Member count: ${guild.memberCount} owned by: ${guild.owner.user.username}!`)
  db.prepare(`DELETE FROM scores WHERE guildId = ?`).run(guild.id)
});

client.on("guildMemberAdd", (member) => {
  if (!member.guild.member(client.user).hasPermission('SEND_MESSAGES')) return;
    if (!member.guild.member(client.user).hasPermission('VIEW_CHANNEL')) return;
    if (!member.guild.member(client.user).hasPermission('READ_MESSAGE_HISTORY')) return;
    const row = db.prepare(`SELECT * FROM scores WHERE guildId = ?`).get(member.guild.id);
    if (row?.antijoin === "enabled") {
      member.user.send(`Anti-join has been enabled in ${member.guild.name}, you have been kicked automatically.`);
      member.guild.members.kick(member.user.id).catch(console.error);
    } else {
      if (!member.guild.members.me.permissions.has('ManageRoles')) return;
      const autoRole = member.guild.roles.cache.find(r => r.name === row.roletogive);
      if (autoRole) {
        member.roles.add(autoRole).catch(console.error);
      }}
});

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();
  if (user.bot) return;
  if (reaction.emoji.name !== "⭐") return;

  const message = reaction.message;

  if (message.author.bot) return;
  if (message.channel.type === ChannelType.DM) return;

  const me = message.guild.members.me;

  if (!me.permissions.has(PermissionsBitField.Flags.SendMessages)) return;
  if (!me.permissions.has(PermissionsBitField.Flags.ViewChannel)) return;
  if (!me.permissions.has(PermissionsBitField.Flags.ReadMessageHistory)) return;

  if (user.id === message.author.id) {
    return message.channel.send(`${message.author}, You can't star your own messages !`);
  }

  const starboardChannel = message.guild.channels.cache.find(
    (ch) => ch.name === "starboard" && ch.type === ChannelType.GuildText
  );
  if (!starboardChannel) return;

  const starCount = message.reactions.cache.get("⭐")?.count || 0;
  if (starCount > 1) return;

  const embed = new EmbedBuilder()
    .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
    .setColor(0x00A2E8)
    .setTitle(`⭐ ${client.user.username} Starboard ⭐`)
    .addFields(
      { name: "Starred by", value: user.username, inline: true },
      { name: "Channel", value: `<#${message.channel.id}>`, inline: true },
      { name: "Message", value: message.content || "*Aucun contenu*", inline: false }
    )
    .setTimestamp();

  starboardChannel.send({ embeds: [embed] }).catch(console.error);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || message.channel.type === ChannelType.DM) return;

  const row = db.prepare("SELECT * FROM scores WHERE guildId = ?").get(message.guild.id);
  if (!row) return;

  const prefix = row.prefix;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);

  // Mention bot
  if (message.mentions.has(client.user)) {
    console.log("Bot mentionné: ", message.content);
    return message.reply(`current guild prefix is \`${prefix}\`.`);
  }

  // Invite Link Protection
  if (invitecheck.some(word => message.content.toLowerCase().includes(word))) {
    if (
      !message.content.includes(prefix) &&
      row.automoderation === "enabled" &&
      row.invitelinkprotection === "enabled" &&
      !message.member.permissions.has("KICK_MEMBERS")
    ) {
      message.delete();
      const modlog = message.guild.channels.cache.find(c => c.name === row.logschannel);
      if (modlog && row.logsenabled === "enabled") {
        const embed = new Discord.EmbedBuilder()
          .setColor(0x00A2E8)
          .setTitle("Action: Auto Moderation")
          .addFields(
            { name: "Moderator", value: `${client.user.username} (ID: ${client.user.id})` },
            { name: "User", value: `${message.author.username} (ID: ${message.author.id})` },
            { name: "In channel", value: message.channel.name, inline: true },
            { name: "Reason", value: "Invite Link", inline: true },
            { name: "Invite link", value: message.cleanContent }
          )
          .setFooter({ text: "Time used: " + message.createdAt.toDateString() });
        modlog.send({ embeds: [embed] });
      }
      return message.reply("not allowed to post invite links.").then(m => m.delete({ timeout: 6000 }));
    }
  }

  // Website Link Protection
  if (weblinkcheck.some(word => message.content.toLowerCase().includes(word))) {
    if (
      !message.content.includes(prefix) &&
      row.automoderation === "enabled" &&
      row.websitelinkprotection === "enabled" &&
      !message.member.permissions.has("KICK_MEMBERS")
    ) {
      message.delete();
      const modlog = message.guild.channels.cache.find(c => c.name === row.logschannel);
      if (modlog && row.logsenabled === "enabled") {
        const embed = new Discord.EmbedBuilder()
          .setColor(0x00A2E8)
          .setTitle("Action: Auto Moderation")
          .addFields(
            { name: "Moderator", value: `${client.user.username} (ID: ${client.user.id})` },
            { name: "User", value: `${message.author.username} (ID: ${message.author.id})` },
            { name: "In channel", value: message.channel.name, inline: true },
            { name: "Reason", value: "Website Link", inline: true },
            { name: "Website link", value: message.cleanContent }
          )
          .setFooter({ text: "Time used: " + message.createdAt.toDateString() });
        modlog.send({ embeds: [embed] });
      }
      return message.reply("not allowed to post website links.").then(m => m.delete({ timeout: 6000 }));
    }
  }

  // Duplicate Characters Protection
  if (
    !message.content.includes(prefix) &&
    row.automoderation === "enabled" &&
    row.dupcharactersprotection === "enabled" &&
    !message.member.permissions.has("KICK_MEMBERS")
  ) {
    const text = args.join(" ");
    if (!text.includes(".")) {
      const hasDuplicates = /([a-zA-Z])\1+$/;
      if (hasDuplicates.test(text)) {
        message.delete();
        const modlog = message.guild.channels.cache.find(c => c.name === row.logschannel);
        if (modlog && row.logsenabled === "enabled") {
          const embed = new Discord.EmbedBuilder()
            .setColor(0x00A2E8)
            .setTitle("Action: Auto Moderation")
            .addFields(
              { name: "Moderator", value: `${client.user.username} (ID: ${client.user.id})` },
              { name: "User", value: `${message.author.username} (ID: ${message.author.id})` },
              { name: "In channel", value: message.channel.name, inline: true },
              { name: "Reason", value: "Duplicated Characters", inline: true },
              { name: "Message Content", value: message.cleanContent }
            )
            .setFooter({ text: "Time used: " + message.createdAt.toDateString() });
          modlog.send({ embeds: [embed] });
        }
        return message.reply("message contains duplicated characters.").then(m => m.delete({ timeout: 6000 }));
      }
    }
  }

  // Slowmode
  if (
    row.slowmode === "enabled" &&
    !message.member.permissions.has("KICK_MEMBERS")
  ) {
    if (checkCooldown(message.author.id)) {
      return message.delete();
    }
    cooldownUsers.add(message.author.id);
    removeCooldown(message.author.id, row.slowmodetime);
  }

  // Système d'XP
  const row2 = db.prepare("SELECT * FROM scores WHERE guildId = ?").get(message.guild.id);
  if (!row2 || row2.levelsystem !== "enabled") return;

  if (talkedRecently.has(message.author.id)) return;
  talkedRecently.add(message.author.id);
  setTimeout(() => talkedRecently.delete(message.author.id), 60000);

  const xpgained = Math.floor(Math.random() * 15) + 1;

  let profile = db.prepare("SELECT * FROM profiles WHERE guildId = ? AND userId = ?")
    .get(message.guild.id, message.author.id);

  if (!profile) {
    db.prepare("INSERT INTO profiles (guildId, userId, xp, level, bank, cash, awards, rep, username, winningchance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(message.guild.id, message.author.id, 0, 1, 0, 100, "None", 0, message.author.username, 0);
  } else {
    let newXP = profile.xp + xpgained;
    let newLevel = Math.floor(0.1 * Math.sqrt(newXP));
    let newCash = profile.cash + 10;

    if (newLevel > profile.level && newLevel < 300) {
      db.prepare("UPDATE profiles SET xp = ?, level = ?, cash = ?, username = ? WHERE guildId = ? AND userId = ?")
        .run(newXP, newLevel, newCash, message.author.username, message.guild.id, message.author.id);
    } else {
      if (newXP < 9999999) {
        db.prepare("UPDATE profiles SET xp = ?, cash = ?, username = ? WHERE guildId = ? AND userId = ?")
          .run(newXP, newCash, message.author.username, message.guild.id, message.author.id);
      }
    }

    // Récompenses
    const awards = profile.awards === "None" ? "" : profile.awards;
    if (newLevel === 25 && !awards.includes(":tada:")) {
      db.prepare("UPDATE profiles SET awards = ? WHERE guildId = ? AND userId = ?")
        .run(awards + ":tada:", message.guild.id, message.author.id);
    } else if (newLevel === 50 && !awards.includes(":medal:")) {
      db.prepare("UPDATE profiles SET awards = ? WHERE guildId = ? AND userId = ?")
        .run(awards + " :medal:", message.guild.id, message.author.id);
    } else if (newLevel === 100 && !awards.includes(":trophy:")) {
      db.prepare("UPDATE profiles SET awards = ? WHERE guildId = ? AND userId = ?")
        .run(awards + " :trophy:", message.guild.id, message.author.id);
    } else if (profile.cash >= 10000 && !awards.includes(":moneybag:")) {
      db.prepare("UPDATE profiles SET awards = ? WHERE guildId = ? AND userId = ?")
        .run(awards + " :moneybag:", message.guild.id, message.author.id);
    } else if (profile.cash >= 100000 && !awards.includes(":credit_card:")) {
      db.prepare("UPDATE profiles SET awards = ? WHERE guildId = ? AND userId = ?")
        .run(awards + " :credit_card:", message.guild.id, message.author.id);
    }
  }
});

client.login('TOKEN');
