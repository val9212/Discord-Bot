require("discord.js");
const frames = [
	'(-°□°)-  ┬─┬',
	'(╯°□°)╯    ]',
	'(╯°□°)╯  ︵  ┻━┻',
	'(╯°□°)╯       [',
	'(╯°□°)╯           ┬─┬'
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

exports.run = async (client, message) => {
    const msg = await message.channel.send('(\\\\°□°)\\\\  ┬─┬');
    for (const frame of frames) {
        await sleep(100);
        await msg.edit(frame);
    }
};