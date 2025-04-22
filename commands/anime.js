const { Client, EmbedBuilder } = require("discord.js");
const Kitsu = require('kitsu');
const kitsu = new Kitsu();

exports.run = async (client, message, args) => {
    const params = args.join(" ");
    if (params.length < 1) return message.reply('You must add an anime to search for');
    
    let msg = await message.channel.send('*fetching information from Kitsu!*');
    
    try {
        const { data } = await kitsu.fetch('anime', { filter: { text: params } });

        if (!data || data.length === 0) {
            return msg.edit('No anime found with that name.');
        }

        let embed = new EmbedBuilder()
            .setTitle('Choose an anime')
            .setDescription(data.map((anime, index) => `${index + 1}: ${anime.titles.en}`).join("\n"))
            .setColor('#00FF00');
        
        await msg.edit({ content: "Please select an anime by number:", embeds: [embed] });

        const filter = response => {
            return response.author.id === message.author.id && !isNaN(response.content) && response.content > 0 && response.content <= data.length;
        };
        
        const collected = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] });
        const returnMessage = collected.first();
        await returnMessage.delete();

        const index = Number(returnMessage.content) - 1;
        const anime = data[index];

        const animeEmbed = new EmbedBuilder()
            .setTitle(anime.titles.en)
            .setURL(`https://kitsu.io/anime/${anime.id}`)
            .setDescription(anime.synopsis)
            .setColor('#FF4500')
            .setFields(
                { name: 'JP Title', value: anime.titles.en_jp, inline: true },
                { name: 'Type', value: anime.subtype, inline: true },
                { name: 'Start Date', value: anime.startDate, inline: true },
                { name: 'End Date', value: anime.endDate || 'In Progress', inline: true },
                { name: 'Popularity Rank', value: anime.popularityRank.toString(), inline: true }
            );
        
        await msg.edit({ content: "Here is the information for your selected anime:", embeds: [animeEmbed] });
    } catch (error) {
        console.error(error);
        await msg.edit('I encountered an error while trying to fetch the data from Kitsu. Please check the anime name and try again.');
    }
};