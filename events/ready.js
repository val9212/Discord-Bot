const { ActivityType } = require('discord.js');
const fs = require('fs');
const superagent = require('superagent');
const Database = require('better-sqlite3');
const db = new Database('./assets/guildsettings.sqlite');

module.exports = async (client) => {
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
    levelsystem TEXT,
    starsys TEXT,
    starchannel TEXT
  )`).run();
  db.prepare(`CREATE TABLE IF NOT EXISTS profiles (
    guildId TEXT,
    userId TEXT,
    xp INTEGER,
    level INTEGER,
    bank INTEGER,
    cash INTEGER,
    awards TEXT,
    rep INTEGER,
    username TEXT,
    winningchance INTEGER,
    PRIMARY KEY (guildId, userId)
  )`).run();
  
  fs.readdir('./commands/', (err, files) => {
    if (err) return console.error(err);
    console.log(`[COMMANDS] Loaded ${files.length} commands successfully!`);
  });
  
  console.log(`[READY] Logged in as ${client.user.tag}! (${client.user.id})`);
  
  const activities = [
    { text: "with blitz the furry", type: ActivityType.Playing },
    { text: "with your heart", type: ActivityType.Playing },
    { text: "Andrew", type: ActivityType.Watching },
    { text: "Cities: Skylines", type: ActivityType.Playing },
    { text: `over ${client.guilds.cache.size} servers`, type: ActivityType.Watching },
    { text: `>help - In ${client.guilds.cache.size} servers`, type: ActivityType.Playing },
    { text: "Unreal Editor", type: ActivityType.Playing },
    { text: "Visual Studio Code", type: ActivityType.Playing },
    { text: "Terraria", type: ActivityType.Playing },
    { text: "NETFLIX", type: ActivityType.Watching },
    { text: "Rap God", type: ActivityType.Listening },
    { text: "House Of Cards", type: ActivityType.Listening },
  ];
  
  setInterval(() => {
    const activity = activities[Math.floor(Math.random() * activities.length)];
    client.user.setActivity(activity.text, { type: activity.type });
  }, 60*60*1000);
  
  /*
    try {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      await client.user.setActivity(activity.text, { type: activity.type });

      const serverCount = Math.ceil(client.guilds.cache.size);
      const shardCount = "1";

      // discordbots.org
      await superagent.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
        .set('Authorization', 'KEY')
        .send({ server_count: serverCount, shard_count: shardCount })
        .then(() => console.log('Updated discordbots.org status.'))
        .catch(e => console.warn('discordbots.org down - spam @oliy'));

      // bots.discord.pw
      await superagent.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
        .set('Authorization', 'KEY') 
        .send({ server_count: serverCount, shard_count: shardCount })
        .then(() => console.log('Updated bots.discord.pw status.'))
        .catch(e => console.warn('bots.discord.pw down - spam @oliy'));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }, 3600000); 
  */
};

