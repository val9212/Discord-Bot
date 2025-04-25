const { EmbedBuilder } = require('discord.js');

exports.run = (client, message, args) => {
    const botstatus = ['Online', 'Idle', 'Do Not Disturb', 'Invisible'];
    
    const status = client.user.presence.status;
    let statusText = '';

    switch (status) {
        case 'online':
            statusText = botstatus[0];
            break;
        case 'idle':
            statusText = botstatus[1];
            break;
        case 'dnd':
            statusText = botstatus[2];
            break;
        case 'invisible':
            statusText = botstatus[3];
            break;
        default:
            statusText = 'Unknown';
    }

    const embed = new EmbedBuilder()
        .addFields(
            { name: "Bot Status", value: statusText }
        );

    message.channel.send({ embeds: [embed] });
};
