const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Database = require('better-sqlite3');
const db = new Database("./assets/guildsettings.sqlite");

exports.run = async (client, message, args) => {
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    return message.reply('Sorry, I need `MANAGE_ROLES` permission to perform this command. :x:');
  }

  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
    return message.reply('You need `MANAGE_ROLES` permission to use this command.');
  }

  const row = db.prepare('SELECT * FROM scores WHERE guildId = ?').get(message.guild.id);
  if (!row) return message.channel.send('Settings not found for this server.');

  const prefix = row.prefix || '!';

  if (message.mentions.members.size < 1) {
    const usageEmbed = new EmbedBuilder()
      .setColor(0x00A2E8)
      .setThumbnail(client.user.displayAvatarURL())
      .setTitle(`Command: ${prefix}giverole`)
      .addFields(
        { name: 'Usage', value: `${prefix}giverole @Someone <role name>`, inline: false },
        { name: 'Example', value: `${prefix}giverole @Someone WeebSquad`, inline: false },
        { name: 'Description', value: 'Gives a user a role in the current server.', inline: false }
      );

    return message.channel.send({ embeds: [usageEmbed] });
  }

  const user = message.mentions.members.first();
  const roleName = args.slice(1).join(' ');

  if (!roleName) return message.reply('You must specify a role name.');
  
  const role = message.guild.roles.cache.find(r => r.id === roleName);
  if (!role) return message.channel.send('Role not found. Make sure you spelled it exactly.');

  if (user.roles.highest.position >= message.member.roles.highest.position) {
    return message.reply('I cannot give a role to someone with an equal or higher role than you. :x:');
  }

  if (role.position >= message.guild.members.me.roles.highest.position) {
    return message.reply('I cannot give roles that are equal or higher than my highest role. :x:');
  }

  try {
    await user.roles.add(role);
  } catch (error) {
    console.error(error);
    return message.channel.send('Failed to assign the role. Check my permissions and role hierarchy.');
  }

  await message.channel.send(`✅ ${user.user.username} has been given the role: **${roleName}**`);

  const newCaseNumber = row.casenumber + 1;
  db.prepare('UPDATE scores SET casenumber = ? WHERE guildId = ?').run(newCaseNumber, message.guild.id);

  const modlogChannel = message.guild.channels.cache.find(c => c.id === row.logschannel);
  if (!modlogChannel || row.logsenabled === 'disabled') return;

  const logEmbed = new EmbedBuilder()
    .setColor(0x00A2E8)
    .setTitle(`Case #${row.casenumber} | Action: Given Role`)
    .addFields(
      { name: 'Moderator', value: `${message.author.tag} (ID: ${message.author.id})`, inline: false },
      { name: 'User', value: `${user.user.tag} (ID: ${user.user.id})`, inline: false },
      { name: 'Role Given', value: role.name, inline: false }
    )
    .setFooter({ text: `Time used: ${message.createdAt.toDateString()}` });

  await modlogChannel.send({ embeds: [logEmbed] });
};
