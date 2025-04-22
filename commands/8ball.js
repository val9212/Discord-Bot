const { EmbedBuilder } = require('discord.js');

exports.run = (client, message, args) => {
  const question = args.join(' ');
  if (!question) return message.channel.send('You did not give the bot a question.');

  const responses = [
    'It is certain.',
    'No doubt about it.',
    'No chance.',
    'Maybe, time will tell.',
    'No way.',
    'Concentrate and try again.',
    'As I see it, yes.',
    'Outlook good.',
    'Most likely.',
    'Better not tell you now.',
    'My sources say no.',
    'Signs point to yes.',
    'Yes definitely.',
    'It is decidedly so.',
    'Outlook not so good.',
    'Very doubtful.'
  ];

  const embed = new EmbedBuilder()
    .setColor(0x00A2E8)
    .setTitle('🎱 Orcinus - Magic 8 Ball')
    .addFields(
      { name: 'You asked', value: question },
      { name: 'Orcinus says', value: responses[Math.floor(Math.random() * responses.length)] }
    )
    .setThumbnail("https://www.pngmart.com/files/3/8-Ball-Pool-Transparent-PNG.png")
    .setFooter({ text: `Requested by ${message.author.tag}` })
    .setTimestamp();

  message.channel.send({ embeds: [embed] });
};
