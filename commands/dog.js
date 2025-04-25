const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  try {
    const response = await fetch('https://random.dog/woof.json');
    const body = await response.json();

    if (body.url.endsWith('.mp4') || body.url.endsWith('.webm')) return;

    const embed = new EmbedBuilder()
      .setColor(0x00A2E8)
      .setImage(body.url);

    await message.channel.send({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    message.channel.send("Something went wrong fetching the dog image.");
  }
};
