const Discord = require("discord.js");
const request = require("request")
const bot = new Discord.Client();
exports.run = async (client, message, args) => {
        var estoBanList = [
            "9/11",
            "swastika",
            "kids",
            "jew",
            "hitler",
            "murder",
            "suicidal",
            "suicide",
            "dead",
            "retard",
            "gore",
            "retarded",
            "cancer",
            "cancerous",
            "scat",
            "shit",
            "crap",
            "poo",
            "pee",
            "feces",
            "urin",
            "piss",
            "diaper",
            "baby",
            "babies",
            "defecation",
            "child",
            "kid",
            "young",
            "tod",
            "cub",
            "loli",
            "underaged",
            "toddler",
            "cake_farts",
            "diarrhea",
            "soiled",
            "snuff",
            "watersports",
            "unbirthing",
            "hyper",
            "expansion",
            "inflation",
            "guro",
            "nightmare_fuel"
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
                url: 'https://e926.net/post/index.json?tags=order:random+' + tagestosplit,
                headers: {
                    'User-Agent': 'bot pineapple'

                }
            }

            request(estoHeader,
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var estoThing = JSON.parse(body);
                    if (typeof (estoThing[0]) != "undefined") {
                        message.channel.send(estoThing[0].file_url.toString().replace('https', 'http'))
                        console.log(`SFW ${estoThing[0].file_url} SFW`);
                        }else{
                            message.channel.send("No pictures found. *try another tag*")
                        }}})}