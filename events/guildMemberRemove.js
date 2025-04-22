const { ChannelType } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database('./assets/guildsettings.sqlite');

module.exports = async (client, member) => {
  if (member.user.bot) return;

  const row = db.prepare('SELECT * FROM scores WHERE guildId = ?').get(member.guild.id);
  if (!row || row.wlsystem === 'disabled') return;

  const goodbyeMessage = (row.leavemessage || '')
    .replace('%MENTION%', `<@${member.user.id}>`)
    .replace('%TAG%', member.user.tag)
    .replace('%DISCRIMINATOR%', member.user.discriminator)
    .replace('%USERID%', member.user.id)
    .replace('%GUILDNAME%', member.guild.name)
    .replace('%NAME%', member.user.username)
    .replace('%MEMBERCOUNT%', member.guild.memberCount);

  try {
    if (row.dmmessage === 'enabled') {
      await member.user.send(goodbyeMessage);
    } else {
      const channel = member.guild.channels.cache.find(c => c.id === row.wlchannel && c.type === ChannelType.GuildText);
      if (channel) await channel.send(goodbyeMessage);
    }
  } catch (err) {
    console.error(err);
  }
};