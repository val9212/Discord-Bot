const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const config = require('../config.js');

exports.run = async (client, message, args) => {
  const query = args.join(' ');
  if (!query) {
    return message.channel.send("You didn't provide a book title to search for.");
  }

  try {
    const apiKey = config.GOOGLE_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return message.channel.send("No book found with that title.");
    }

    const info = data.items[0].volumeInfo;
    const description = info.description ? info.description.slice(0, 600) + (info.description.length > 600 ? "..." : "") : "No description available.";

    const embed = new EmbedBuilder()
      .setColor(0x00A2E8)
      .setTitle(info.title || "Unknown title")
      .addFields(
        { name: "Author(s)", value: info.authors ? info.authors.join(', ') : "Unknown", inline: true },
        { name: "Publisher", value: info.publisher || "Unknown", inline: true },
        { name: "Page Count", value: info.pageCount ? info.pageCount.toString() : "N/A", inline: true },
        { name: "Genres", value: info.categories ? info.categories.join(', ') : "???", inline: false },
        { name: "Description", value: description, inline: false },
        { name: "Purchase link", value: info.canonicalVolumeLink || "Not available", inline: false }
      );

    if (info.imageLinks && info.imageLinks.thumbnail) {
      embed.setThumbnail(info.imageLinks.thumbnail);
    }

    await message.channel.send({ embeds: [embed] });
  } catch (err) {
    console.error("Error fetching book data:", err);
    message.channel.send("Something went wrong while searching for that book. :x:");
  }
};

   
