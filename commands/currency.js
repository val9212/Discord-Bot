const fetch = require('node-fetch');
const config = require('../config.js')

exports.run = async (client, message, args) => {
    const base = args[0]?.toUpperCase();
    const to = args[1]?.toUpperCase();
    const amount = parseFloat(args[2]);

    if (!base || !to || isNaN(amount)) {
        return message.channel.send("Usage: `!convert <from_currency> <to_currency> <amount>`");
    }

    if (base === to) {
        return message.channel.send(`Converting ${base} to ${to} is the same value.`);
    }

    try {
        const response = await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${config.FREECURRENCY_KEY}&base_currency=${base}&currencies=${to}`);
        const data = await response.json();

        if (!data.data || !data.data[to]) {
            return message.channel.send("Invalid currency code or API error.");
        }

        const rate = data.data[to];
        const converted = (amount * rate).toFixed(2);
        message.channel.send(`${amount} ${base} is approximately ${converted} ${to}.`);
    } catch (error) {
        console.error(error);
        message.channel.send("An error occurred while fetching exchange rates.");
    }
};
