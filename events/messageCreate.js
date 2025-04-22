const { ChannelType, PermissionsBitField } = require('discord.js');
const path = require('path');
const fs = require('fs');
const db = require('better-sqlite3')('./assets/guildsettings.sqlite');

module.exports = async (client, message) => {
  if (message.author.bot) return;

  if (message.channel.type !== ChannelType.GuildText) {
    console.log("Le message ne provient pas d'un canal texte.");
    return;
  }

  let row = db.prepare('SELECT * FROM scores WHERE guildId = ?').get(message.guild.id);
  if (!row) {
    console.log("Aucune configuration trouvée pour ce serveur.");
    db.prepare(`
      INSERT INTO scores (
        guildId, prefix, casenumber, autoroleenabled, roletogive, logsenabled, logschannel,
        automoderation, wlchannel, wlsystem, welcomemessage, leavemessage, dmmessage,
        slowmode, slowmodetime, invitelinkprotection, websitelinkprotection,
        dupcharactersprotection, antijoin, modonlycommands, botlock, botlockchannel, levelsystem
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      message.guild.id, ">", 1, "enabled", "none", "enabled", "logs",
      "disabled", "welcome", "disabled", "Hello %MENTION%, welcome to %GUILDNAME%.",
      "%NAME% has left the guild", "disabled", "disabled", 3,
      "disabled", "disabled", "disabled", "disabled", "disabled", "disabled", "bot-commands", "disabled"
    );
    return;
  }

  const prefix = row.prefix || ">";

  if (!message.content.startsWith(prefix)) {

    return;
  }
  
  if (row.modonlycommands === "enabled") {
    const member = message.guild.members.cache.get(message.author.id);
    if (!member?.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      console.log("L'utilisateur n'a pas les permissions nécessaires.");
      return;
    }
  }

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  console.log(`[UwU Bot] [${message.guild.name}] [${message.author.tag}] ${prefix}${commandName} ${args.join(" ")}`);

  try {
    const commandPath = path.join(__dirname, '../commands', `${commandName}.js`);
    if (!fs.existsSync(commandPath)) {
      console.log(`Commande introuvable : ${commandName}`);
      return;
    }

    const command = require(commandPath);
    if (command.run) {
      console.log(`Exécution de la commande ${commandName}`);
      await command.run(client, message, args);
    }
  } catch (err) {
    console.error(`Erreur dans la commande ${commandName}:`, err);
  }
};
