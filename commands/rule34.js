const Discord = require("discord.js");
const request = require("request")
const bot = new Discord.Client();
exports.run = async (client, message, args) => {
    const https = require("https");
    const xml2js = require('xml2js');
     
       
            try {
               
                if(message.channel.nsfw){
                    if(args[0] === undefined){
                        var argR = "";
                    } else {
                        var argR = args;
                    }
     
                    var url = 'https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + argR;
     
                    https.get(url, function(res){
                        var body = '';
               
                        res.on('data', function(chunk){
                            body += chunk;
                        });
               
                        res.on('end', function(){
                            var parser = new xml2js.Parser();
                            parser.parseString(body, function (err, result) {
                                var postCount = result.posts.$.count - 1;
                                if(postCount > 100) {
                                    postCount = 100;
                                }
                                if(postCount > 0) {
                                    var picNum = Math.floor(Math.random() * postCount) + 0;
                                    var r34Pic = result.posts.post[picNum].$.file_url;
                                    // console.log(result.posts.post[picNum].$.file_url);
                                    message.channel.send({
                                        files: [r34Pic]
                                    });
                               
                                } else {
                                    console.log("NSFW", argR);
                                    message.channel.send("No pictures found. *try another tag*!");
                                }
     
                                });
                            });
                        }).on('error', function(e){
                            console.log("Got an error: ", e);
                    });
                } else {
                    message.channel.send(":underage: NSFW Command. Please switch to NSFW channel in order to use this command.");
                }
            } catch(e) {
                console.log(e);
            }
            }
     