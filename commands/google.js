const { EmbedBuilder } = require('discord.js');
const got = require('got').default;
const cheerio = require('cheerio');

const QUERY_STRING_SETTINGS = [
  'client=chrome',
  'rls=en',
  'ie=UTF-8',
  'oe=UTF-8'
].join('&');

function getText(children) {
  if (children.children) return getText(children.children);
  return children.map(c => {
    return c.children ? getText(c.children) : c.data;
  }).join('');
}

exports.run = async (client, message, args) => {
  if (args.length < 1) {
    return message.reply('You must enter something to search for!');
  }

  try {
    const res = await got(`https://google.com/search?${QUERY_STRING_SETTINGS}&q=${encodeURIComponent(args.join(' '))}`);
    
    if (res.statusCode !== 200) {
      return message.channel.send(`Error! (${res.statusCode}): ${res.statusMessage}`);
    }

    let $ = cheerio.load(res.body);
    let results = [];

    $('.g').each((i, e) => {
      results[i] = {};
    });

    $('.g>.r>a').each((i, e) => {
      let raw = e.attribs['href'];
      results[i]['link'] = decodeURIComponent(raw.substr(7, raw.indexOf('&sa=U') - 7));
    });

    $('.g>.s>.st').each((i, e) => {
      results[i]['description'] = getText(e);
    });

    let output = results.filter(r => r.link && r.description)
      .slice(0, 3)
      .map(r => `${r.link}\n\t${r.description}\n`)
      .join('\n');

    if (output.length < 1) {
      return message.channel.send(`No results for: "${args.join(" ")}"`);
    }

    const filtercheck = ["xxx", "porn", "fuck", "sex", "18+", "anal", "gay", "lesbian", "dick", "cock", "boobs", "ass", "nsfw", "tits", "nudes", "hentai", "nodes", "vagina", "pussy", "penis"];
    if (filtercheck.some(word => output.toLowerCase().includes(word))) {
      return message.channel.send("Not allowed to google NSFW content.");
    }

    const embed = new EmbedBuilder()
      .setColor(0x00A2E8)
      .setTitle(`Search results for "${args.join(' ')}"`)
      .setDescription(output);

    return message.channel.send({ embeds: [embed] });

  } catch (error) {
    console.error(error);
    return message.channel.send('An error occurred while searching.');
  }
};
