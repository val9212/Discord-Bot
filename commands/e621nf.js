const Discord = require("discord.js");
const request = require("request")
const bot = new Discord.Client();
exports.run = async (client, message, args) => {
    if (!message.channel.nsfw) {
        message.channel.send(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.")
    } else {
        var estoBanList = [
            "jew",
            "hitler",

        ]
        var tagesto = "";
        var args = message.content.split(" ").slice(1);
        var tagestosplit = args.join(" ")
        console.log(`NSFW ${tagestosplit} NSFW`);
            if(estoBanList.indexOf(tagestosplit) != -1){
                message.channel.send("banned tag :thinking: ?!");
                return;
            }

            tagesto = tagestosplit

            var estoHeader = {
                url: 'https://e621.net/post/index.json?tags=order:random+' + tagestosplit,
                headers: {
                    'User-Agent': 'bot pineapple'

                }
            }

            request(estoHeader,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var estoThing = JSON.parse(body);
                    if (typeof (estoThing[0]) != "undefined") {
                        message.channel.send(estoThing[0].file_url.toString());
                        console.log(`NSFW ${estoThing[0].file_url} NSFW`);
                        }else{
                            message.channel.send("No pictures found. *try another tag* \n **some tags are banned or auto removed !!**")
                }}     })}}