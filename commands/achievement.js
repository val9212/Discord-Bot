const { AttachmentBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
  const text = args.join(" ");
  if (!text) return message.channel.send("You need to provide text for the achievement.");
  if (text.length > 25) return message.reply("Text must be under 25 characters.");

  const block = 'grass'; 
  const title = 'Achievement..Get'; 
  const string1 = encodeURIComponent(text);
  const string2 = encodeURIComponent(''); 

  const imageUrl = `https://minecraft-api.com/api/achivements/${block}/${title}/${string1}/${string2}`;
  
  try {
    await message.channel.send(imageUrl);
  } catch (err) {
    console.error(err);
    message.channel.send("❌ There was an error generating the achievement.");
  }
};