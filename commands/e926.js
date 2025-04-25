const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const config = require("../config.js")

exports.run = async (client, message, args) => {


  const bannedTags = [
    "shota", "age_difference", "stocking", "9/11", "swastika", "kids", "jew",
    "hitler", "murder", "suicidal", "suicide", "dead", "retard", "gore",
    "retarded", "cancer", "cancerous", "scat", "shit", "crap", "poo", "pee",
    "feces", "urin", "piss", "diaper", "baby", "babies", "defecation", "child",
    "kid", "young", "tod", "cub", "loli", "underaged", "toddler", "cake_farts",
    "diarrhea", "soiled", "snuff", "watersports", "unbirthing", "hyper",
    "expansion", "inflation", "guro", "nightmare_fuel"
  ];

  const tags = args.join(' ').toLowerCase();

  if (bannedTags.some(tag => tags.includes(tag))) {
    return message.channel.send("Banned tag detected. :thinking:");
  }

  try {
    const response = await fetch(`https://e926.net/posts.json?tags=order:random+${encodeURIComponent(tags)}+-young+-child+-cub+-loli+-shota`, {
      headers: {
        'User-Agent': `${config.E621_USER}`
      }
    });

    if (!response.ok) {
      return message.channel.send("Failed to fetch data from e621.");
    }

    const data = await response.json();

    if (!data.posts || data.posts.length === 0) {
      return message.channel.send("No results found. Try different tags.");
    }

    const post = data.posts[Math.floor(Math.random() * data.posts.length)];

    const embed = new EmbedBuilder()
      .setTitle(`Post #${post.id}`)
      .setURL(`https://e621.net/posts/${post.id}`)
      .setImage(post.file.url)
      .setColor(0x00A2E8)
      .setFooter({ text: `Tags: ${post.tags.general.slice(0, 5).join(', ')}...` });

    await message.channel.send({ embeds: [embed] });
  } catch (error) {
    console.error(error);
    message.channel.send("An error occurred while fetching data from e621.");
  }
};
