const Database = require('better-sqlite3');
const db = new Database('./assets/guildsettings.sqlite');

module.exports = (client, guild) => {
  db.prepare(`CREATE TABLE IF NOT EXISTS scores (
    guildId TEXT PRIMARY KEY,
    prefix TEXT,
    casenumber INTEGER,
    autoroleenabled TEXT,
    roletogive TEXT,
    logsenabled TEXT,
    logschannel TEXT,
    automoderation TEXT,
    wlchannel TEXT,
    wlsystem TEXT,
    welcomemessage TEXT,
    leavemessage TEXT,
    dmmessage TEXT,
    slowmode TEXT,
    slowmodetime INTEGER,
    invitelinkprotection TEXT,
    websitelinkprotection TEXT,
    dupcharactersprotection TEXT,
    antijoin TEXT,
    modonlycommands TEXT,
    botlock TEXT,
    botlockchannel TEXT,
    levelsystem TEXT
  )`).run();

  const row = db.prepare('SELECT * FROM scores WHERE guildId = ?').get(guild.id);

  if (!row) {
    db.prepare(`INSERT INTO scores (
      guildId, prefix, casenumber, autoroleenabled, roletogive, logsenabled,
      logschannel, automoderation, wlchannel, wlsystem, welcomemessage,
      leavemessage, dmmessage, slowmode, slowmodetime, invitelinkprotection,
      websitelinkprotection, dupcharactersprotection, antijoin, modonlycommands,
      botlock, botlockchannel, levelsystem
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      guild.id, ">", 1, "enabled", "none", "enabled", "logs", "disabled",
      "welcome", "disabled", "Hello %MENTION%, welcome to %GUILDNAME%.",
      "%NAME% has left the guild", "disabled", "disabled", 3, "disabled",
      "disabled", "disabled", "disabled", "disabled", "disabled", "bot-commands", "disabled"
    );
  }
};
