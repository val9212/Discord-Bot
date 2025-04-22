const { EmbedBuilder, ChannelType } = require('discord.js');
const db = require('better-sqlite3')('./assets/guildsettings.sqlite');

module.exports = async (client, member) => {
  if (member.user.bot) return;

  const row = db.prepare('SELECT * FROM scores WHERE guildId = ?').get(member.guild.id);
  if (!row || row.wlsystem === 'disabled') return;

  const welcomeMessage = (row.welcomemessage || '').replace('%MENTION%', `<@${member.user.id}>`)
    .replace('%GUILDNAME%', member.guild.name)
    .replace('%NAME%', member.user.username)
    .replace('%MEMBERCOUNT%', member.guild.memberCount);

  try {
    if (row.dmmessage === 'enabled') {
      await member.user.send(welcomeMessage);
    } else {
      const channel = member.guild.channels.cache.find(c => c.name === row.wlchannel && c.type === ChannelType.GuildText);
      if (channel) await channel.send(welcomeMessage);
    }
  } catch (err) {
    console.error(err);
  }
};
