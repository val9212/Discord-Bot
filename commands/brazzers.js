const { Client, PermissionsBitField, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas'); 
const fetch = require('node-fetch');
const fs = require('fs/promises');

exports.run = async (client, message, args) => {
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.AttachFiles)) {
    return message.reply("Sorry, I need the `ATTACH_FILES` permission to run this command. :x:");
  }

  if (message.mentions.users.size < 1) {
    return message.channel.send("You didn't mention a user to make them beautiful :eyes:");
  }

  const getSlapped = async (avatarURL) => {
    const plate = await fs.readFile('./assets/images/plate_brazzers.png');
    const avatarURLPng = avatarURL.replace('.gif', '.png') + '?size=512';
    const response = await fetch(avatarURLPng);

    if (!response.ok) {
      throw new Error(`Failed to fetch avatar: ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const avatar = await loadImage(Buffer.from(buffer));
    const plateImage = await loadImage(plate);

    const canvas = createCanvas(634, 675);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#00A2E8';
    ctx.fillRect(0, 0, 634, 675);
    ctx.drawImage(avatar, 0, 0, 634, 675);
    ctx.drawImage(plateImage, 233, 485, 384, 245);

    return canvas.toBuffer();
  };

  try {
    const person = message.mentions.users.first();
    if (!person || !person.displayAvatarURL()) {
      return message.reply("I couldn't find the mentioned user's avatar.");
    }

    const avatarURL = person.displayAvatarURL({ extension: 'png', size: 512 });
    const result = await getSlapped(avatarURL);

    const attachment = new AttachmentBuilder(result, { name: 'brazzers.png' });
    await message.channel.send({ files: [attachment] });
  } catch (error) {
    console.error(error);
    message.reply("An error occurred while generating the image. :x: " + error.message);
  }
};
