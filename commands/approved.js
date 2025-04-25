const { AttachmentBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs/promises');
const { createCanvas, loadImage } = require('canvas');

exports.run = async (client, message, args) => {
  if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.AttachFiles)) {
    return message.reply("Sorry, I don't have the permissions to do this command. I need ATTACH_FILES. :x:");
  }

  const user = message.mentions.users.first();
  if (!user) {
    return message.channel.send("You didn't mention a user to put them behind the approved stamp!");
  }

  try {
    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 256 });
    const [avatar, stamp] = await Promise.all([
      loadImage(avatarURL),
      loadImage('./assets/images/approved.png')
    ]);

    const canvas = createCanvas(250, 250);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(avatar, 0, 0, 250, 250);
    ctx.drawImage(stamp, 0, 0, 250, 250);

    const buffer = canvas.toBuffer('image/png');
    const attachment = new AttachmentBuilder(buffer, { name: 'approved.png' });

    await message.channel.send({ files: [attachment] });

  } catch (error) {
    console.error(error);
    await message.channel.send(":x: Something went wrong while generating the image.");
  }
};
