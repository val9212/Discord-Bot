const { EmbedBuilder, ChannelType } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database('./assets/guildsettings.sqlite');

module.exports = async (client, oldMember, newMember) => {
  if (oldMember.user?.bot) return;
  if (!oldMember.guild || !newMember.guild) return;

  const row = db.prepare('SELECT * FROM scores WHERE guildId = ?').get(oldMember.guild.id);
  if (!row || row.logsenabled === 'disabled') return;

  const logChannel = oldMember.guild.channels.cache.find(c => c.id === row.logschannel && c.type === ChannelType.GuildText);
  if (!logChannel) return;

  const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
  const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

  const baseEmbed = new EmbedBuilder()
    .setColor(0x00A2E8)
    .setThumbnail(newMember.user.displayAvatarURL())
    .addFields({ name: 'User', value: `${newMember.user.tag} (ID: ${newMember.user.id})` })
    .setTimestamp();

  if (removedRoles.size > 0) {
    logChannel.send({
      embeds: [baseEmbed.setDescription(`Roles Removed: ${removedRoles.map(r => r.name).join(', ')}`)],
    });
  }

  if (addedRoles.size > 0) {
    logChannel.send({
      embeds: [baseEmbed.setDescription(`Roles Added: ${addedRoles.map(r => r.name).join(', ')}`)],
    });
  }

  if (oldMember.nickname !== newMember.nickname) {
    logChannel.send({
      embeds: [baseEmbed.setDescription(`Nickname changed: \`${oldMember.nickname || 'None'}\` → \`${newMember.nickname || 'None'}\``)],
    });
  }
};

