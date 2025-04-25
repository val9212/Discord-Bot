const { AttachmentBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs/promises');
const { createCanvas, loadImage } = require('canvas');

exports.run = async (client, message, args) => {
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.AttachFiles)) {
    return message.reply("Sorry, I don't have the permissions to do this command. I need ATTACH_FILES. :x:");
  }

  if (message.mentions.users.size < 1) {
    return message.channel.send("You didn't mention a user to apply the effect!");
  }

  const user = message.mentions.users.first();
  try {
    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 256 });
    const [avatar, plate] = await Promise.all([
      loadImage(avatarURL),
      loadImage('./assets/images/plate_delete.png')
    ]);

    const canvas = createCanvas(550, 275);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(plate, 0, 0, 550, 275);
    ctx.drawImage(avatar, 92, 106, 139, 151);

    const buffer = canvas.toBuffer('image/png');
    const attachment = new AttachmentBuilder(buffer, { name: 'garbagememe.png' });

    await message.channel.send({ files: [attachment] });

  } catch (error) {
    console.error(error);
    await message.channel.send(":x: Something went wrong while generating the image.");
  }
};
