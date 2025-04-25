const { EmbedBuilder } = require('discord.js');
const Database = require("better-sqlite3");
const db = new Database("./assets/guildsettings.sqlite");

exports.run = (client, message, args) => {

  const row = db.prepare('SELECT * FROM scores WHERE guildId = ?').get(message.guild.id);
  if (!row) return message.channel.send("No settings found for this guild.");
  const prefixtouse = row.prefix;

    const content = args.join(" ");

    const usageEmbed = new EmbedBuilder()
    .setColor(0x00A2E8)
    .setThumbnail(client.user.avatarURL())
    .setTitle(`Command: ${prefixtouse}embed`)
    .addFields(
        { name: 'Usage', value: `${prefixtouse}embed [--title "Your Title"] [--color "#HEX"] <your message>` },
        { name: 'Example', value: `${prefixtouse}embed --title "Hello" --color "#ff9900" This is a test embed!` },
        { name: 'Description', value: 'Sends a customizable embed with optional title and color.' }
    );

    if (!content) {
        return message.channel.send({ embeds: [usageEmbed] });
    }

    const embed = new EmbedBuilder()
        .setDescription(content)
        .setColor(0x00A2E8);

    message.channel.send({ embeds: [embed] });
};
