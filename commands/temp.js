const Discord = require("discord.js");
const bot = new Discord.Client();
exports.run = (client, message, args) => {
    const base = args[0]
    const to = args[1]
    const amount = args[2]
        if (base === to) {
            return message.channel.send(`Converting ${base} to ${to} is the same value.`);
        } else if (base === 'celsius') {
            if (to === 'fahrenheit') return message.channel.send(`${amount}°C is ${(amount * 1.8) + 32}°F.`);
            else if (to === 'kelvin') return message.channel.send(`${amount}°C is ${amount + 273.15}°K.`);
        } else if (base === 'fahrenheit') {
            if (to === 'celsius') return message.channel.send(`${amount}°F is ${(amount - 32) / 1.8}°C.`);
            else if (to === 'kelvin') return message.channel.send(`${amount}°F is ${(amount + 459.67) * (5 / 9)}°K.`);
        } else if (base === 'kelvin') {
            if (to === 'celsius') return message.channel.send(`${amount}°K is ${amount - 273.15}°C.`);
            else if (to === 'fahrenheit') return message.channel.send(`${amount}°K is ${(amount * 1.8) - 459.67}°F.`);
        } else {
          message.channel.send("There was a error try again.")
        }
}
   
