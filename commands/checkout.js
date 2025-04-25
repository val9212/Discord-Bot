const { Client, PermissionsBitField, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs/promises');
const { createCanvas, loadImage } = require('canvas');

exports.run = async (client, message, args) => {
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.AttachFiles)) {
    return message.reply('Sorry, I need the `ATTACH_FILES` permission to run this command. :x:');
  }

  if (message.mentions.users.size < 1) {
    return message.channel.send("You didn't mention a user to checkout.");
  }

  const getSlapped = async (slapper, slapped) => {
    const plate = await fs.readFile('./assets/images/plate_checkout.png');
    const pngSlapper = slapper.replace('.gif', '.png');
    const pngSlapped = slapped.replace('.gif', '.png');
    
    const Slapper = await fetch(pngSlapper);
    const Slapped = await fetch(pngSlapped);

    const slapperBuffer = await Slapper.buffer();
    const slappedBuffer = await Slapped.buffer();

    const canvas = createCanvas(850, 475);
    const ctx = canvas.getContext('2d');

    const plateImage = await loadImage(plate);
    ctx.drawImage(plateImage, 0, 0, 850, 475);

    const slapperImage = await loadImage(slapperBuffer);
    ctx.save();
    ctx.beginPath();
    ctx.arc(400 + 66, 57 + 66, 66, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(slapperImage, 400, 57, 131, 131);
    ctx.restore();

    const slappedImage = await loadImage(slappedBuffer);
    ctx.save();
    ctx.beginPath();
    ctx.arc(169 + 85, 100 + 85, 85, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(slappedImage, 169, 100, 169, 169);
    ctx.restore();

    return canvas.toBuffer();
  };

  try {
    const slapped = message.mentions.users.first().displayAvatarURL({ extension: 'png', size: 512 });
    const slapper = message.author.displayAvatarURL({ extension: 'png', size: 512 });

    const result = await getSlapped(slapper, slapped);

    const attachment = new AttachmentBuilder(result, { name: 'checkout.png' });
    await message.channel.send({ files: [attachment] });
  } catch (error) {
    console.error(error);
    message.reply("An error occurred while generating the image. :x:");
  }
};
