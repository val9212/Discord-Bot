const { EmbedBuilder } = require('discord.js');
const db = require('better-sqlite3')('./assets/guildsettings.sqlite');

module.exports = async (client, oldMember, newMember) => {
  if (oldMember.user.bot) return;

  const row = db.prepare('SELECT * FROM scores WHERE guildId = ?').get(oldMember.guild.id);
  if (!row || row.logsenabled === 'disabled') return;

  const logChannel = oldMember.guild.channels.cache.find(c => c.name === row.logschannel);
  if (!logChannel) return;

  const roleDiff = (before, after) => before.roles.cache.filter(r => !after.roles.cache.has(r.id)).first();
  const added = roleDiff(newMember, oldMember);
  const removed = roleDiff(oldMember, newMember);

  const baseEmbed = new EmbedBuilder()
    .setColor(0x00A2E8)
    .setThumbnail(newMember.user.displayAvatarURL())
    .addFields({ name: 'User', value: `${newMember.user.tag} (ID: ${newMember.user.id})` })
    .setTimestamp();

  if (removed) {
    logChannel.send({
      embeds: [baseEmbed.setDescription(`Role Taken: ${removed.name}`)],
    });
  } else if (added) {
    logChannel.send({
      embeds: [baseEmbed.setDescription(`Role Given: ${added.name}`)],
    });
  } else if (oldMember.nickname !== newMember.nickname) {
    logChannel.send({
      embeds: [baseEmbed.setDescription(`New Nickname: ${newMember.nickname || 'None'}`)],
    });
  }
};
