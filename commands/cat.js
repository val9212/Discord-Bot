const { Client, PermissionsBitField, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  try {
    const response = await fetch('http://thecatapi.com/api/images/get?api_key=APIKEY');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const imageUrl = response.url;

    const attachment = new AttachmentBuilder(imageUrl);
    await message.channel.send({ files: [attachment] });
  } catch (err) {
    console.error(err);
    return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
  }
};
