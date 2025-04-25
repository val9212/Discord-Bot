const { Client, PermissionsBitField, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');
const fs = require('fs/promises');
const { createCanvas, loadImage } = require('canvas');

exports.run = async (client, message, args) => {
  // Check if the bot has permission to attach files
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.AttachFiles)) {
    return message.reply('Sorry, I need the `ATTACH_FILES` permission to run this command. :x:');
  }

  // Check if a user was mentioned
  if (message.mentions.users.size < 1) {
    return message.channel.send("You didn't mention a user to have a crush on them.");
  }

  // Function to create the "crush" image
  const getCrushImage = async (slapper, slapped) => {
    try {
      // Load the plate image
      const plate = await fs.readFile('./assets/images/plate_crush.png');
      
      // Replace .gif with .png for avatar URLs
      const pngSlapper = slapper.replace('.gif', '.png');
      const pngSlapped = slapped.replace('.gif', '.png');
      
      // Fetch avatars of the users
      const Slapper = await fetch(pngSlapper);
      const Slapped = await fetch(pngSlapped);

      const slapperBuffer = await Slapper.buffer();
      const slappedBuffer = await Slapped.buffer();

      // Create canvas for the image
      const canvas = createCanvas(600, 873);
      const ctx = canvas.getContext('2d');

      // Load images and handle the canvas drawing
      const slappedImage = await loadImage(slappedBuffer);
      ctx.rotate(-0.09); // Slight rotation
      ctx.drawImage(slappedImage, 109, 454, 417, 417); // Draw slapped image

      // Reset canvas transformation
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
      const plateImage = await loadImage(plate);
      ctx.drawImage(plateImage, 0, 0, 600, 873); // Draw the plate

      const slapperImage = await loadImage(slapperBuffer);
      ctx.save();
      ctx.beginPath();
      ctx.arc(407 + 66, 44 + 66, 66, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(slapperImage, 407, 44, 131, 131);
      ctx.restore();

      return canvas.toBuffer();
    } catch (error) {
      console.error(error);
      throw new Error('Error generating the image.');
    }
  };

  try {
    const slapped = message.mentions.users.first().displayAvatarURL({ extension: 'png', size: 512 });
    const slapper = message.author.displayAvatarURL({ extension: 'png', size: 512 });

    const result = await getCrushImage(slapper, slapped);

    const attachment = new AttachmentBuilder(result, { name: 'crush.png' });
    await message.channel.send({ files: [attachment] });
  } catch (error) {
    console.error(error);
    message.reply("An error occurred while generating the image. :x:");
  }
};
