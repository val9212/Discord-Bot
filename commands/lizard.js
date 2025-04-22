const superagent = require("snekfetch");
const Discord = require('discord.js')

exports.run = async (client, message, args, level) => {
    superagent.get('https://nekos.life/api/v2/img/lizard')
        .end((err, response) => {
      const lewdembed = new Discord.RichEmbed()
      .setTitle("Lizards")
      .setImage(response.body.url)
      .setColor(`#000000`)
      .setFooter(`Tags: lizard`)
      .setURL(response.body.url);
  message.channel.send(lewdembed);
    })
	
}