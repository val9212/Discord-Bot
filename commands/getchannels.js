const { ChannelType } = require('discord.js');

exports.run = async (client, message, args) => {
  const voiceChannels = message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size;
  const textChannels = message.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size;

  await message.channel.send(`Voice Channels: ${voiceChannels} | Text Channels: ${textChannels}`);
};
