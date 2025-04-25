const { AttachmentBuilder, PermissionsBitField } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs/promises');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.AttachFiles)) {
    return message.reply("Sorry, I need the `ATTACH_FILES` permission to run this command. :x:");
  }

  const user = message.mentions.users.first();
  if (!user) return message.channel.send("You didn't mention a user to make them bill!");

  const getBillImage = async (avatarURL) => {
    const plate = await fs.readFile('./assets/images/plate_bill.png');
    const avatarURLPng = avatarURL.replace('.gif', '.png') + '?size=512';
    const response = await fetch(avatarURLPng);
    const buffer = await response.arrayBuffer();
    const avatar = await loadImage(Buffer.from(buffer));
    const plateImage = await loadImage(plate);

    const canvas = createCanvas(325, 150);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#00A2E8';
    ctx.fillRect(0, 0, 325, 150);
    ctx.drawImage(avatar, 80, 0, 150, 150);
    ctx.drawImage(plateImage, 0, 0, 325, 150);

    return canvas.toBuffer();
  };

  try {
    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 512 });
    const result = await getBillImage(avatarURL);
    const attachment = new AttachmentBuilder(result, { name: 'bill.png' });
    await message.channel.send({ files: [attachment] });
  } catch (error) {
    console.error(error);
    message.reply("An error occurred while generating the image. :x:");
  }
};
