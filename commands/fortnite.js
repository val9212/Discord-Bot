const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const config = require('../config.js')

exports.run = async (client, message, args) => {
  const platform = args[0];
  const username = args.slice(1).join(' ');

  if (!platform || !username) {
    return message.channel.send("Usage: `!fortnite [platform] [username]`");
  }

  try {
    const response = await axios.get(`https://public-api.tracker.gg/v2/fortnite/standard/profile/${platform}/${encodeURIComponent(username)}`, {
      headers: {
        'TRN-Api-Key': config.FORTNITE_KEY
      }
    });

    const data = response.data.data;
    const overview = data.segments.find(seg => seg.type === 'overview')?.stats;
    const solo = data.segments.find(seg => seg.metadata.name === 'Solo')?.stats;
    const duo = data.segments.find(seg => seg.metadata.name === 'Duo')?.stats;
    const squad = data.segments.find(seg => seg.metadata.name === 'Squad')?.stats;

    const embed = new EmbedBuilder()
      .setTitle(`${data.platformInfo.platformUserHandle} - ${data.platformInfo.platformSlug}`)
      .setURL(`https://tracker.gg/fortnite/profile/${platform}/${data.platformInfo.platformUserHandle}/overview`)
      .setColor(0x00A2E8)
      .addFields(
        { name: "__Overall__", value: `
**Wins:** ${overview?.wins.displayValue || 'N/A'}
**Win Rate:** ${overview?.winRatio.displayValue || 'N/A'}
**Kills:** ${overview?.kills.displayValue || 'N/A'}
**K/D:** ${overview?.kd.displayValue || 'N/A'}
**Matches Played:** ${overview?.matchesPlayed.displayValue || 'N/A'}
        `, inline: false },
        { name: "__Solo__", value: solo ? `
**Wins:** ${solo.wins.displayValue}
**Kills:** ${solo.kills.displayValue}
**K/D:** ${solo.kd.displayValue}
**Matches Played:** ${solo.matchesPlayed.displayValue}
        ` : "No solo data available.", inline: true },
        { name: "__Duo__", value: duo ? `
**Wins:** ${duo.wins.displayValue}
**Kills:** ${duo.kills.displayValue}
**K/D:** ${duo.kd.displayValue}
**Matches Played:** ${duo.matchesPlayed.displayValue}
        ` : "No duo data available.", inline: true },
        { name: "__Squad__", value: squad ? `
**Wins:** ${squad.wins.displayValue}
**Kills:** ${squad.kills.displayValue}
**K/D:** ${squad.kd.displayValue}
**Matches Played:** ${squad.matchesPlayed.displayValue}
        ` : "No squad data available.", inline: true }
      );

    await message.channel.send({ embeds: [embed] });

  } catch (error) {
    console.error(error.response?.data || error.message);

    const errorEmbed = new EmbedBuilder()
      .setDescription('The player could not be found or the platform is invalid.\nPlease double-check the username and platform.')
      .setColor(0xFF0000);

    await message.channel.send({ embeds: [errorEmbed] });
  }
};
