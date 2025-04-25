const { AttachmentBuilder, PermissionsBitField } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs/promises');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.AttachFiles)) {
    return message.reply("Sorry, I need the `ATTACH_FILES` permission to run this command. :x:");
  }

  const user = message.mentions.users.first();
  if (!user) return message.channel.send("You didn't mention a user to make them beautiful!");

  const getBeautifulImage = async (avatarURL) => {
    const plate = await fs.readFile('./assets/images/plate_beautiful.png');
    const pngAvatarURL = avatarURL.replace('.gif', '.png') + '?size=512';
    const response = await fetch(pngAvatarURL);
    const avatarBuffer = await response.arrayBuffer();
    const avatarImage = await loadImage(Buffer.from(avatarBuffer));
    const plateImage = await loadImage(plate);

    const canvas = createCanvas(634, 675);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#00A2E8';
    ctx.fillRect(0, 0, 634, 675);
    ctx.drawImage(avatarImage, 423, 45, 168, 168);
    ctx.drawImage(avatarImage, 426, 382, 168, 168);
    ctx.drawImage(plateImage, 0, 0, 634, 675);

    return canvas.toBuffer();
  };

  try {
    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 512 });
    const resultBuffer = await getBeautifulImage(avatarURL);
    const attachment = new AttachmentBuilder(resultBuffer, { name: 'beautiful.png' });
    await message.channel.send({ files: [attachment] });
  } catch (err) {
    console.error(err);
    message.reply("Something went wrong while generating the image. :x:");
  }
};
