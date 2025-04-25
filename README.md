# Discord Bot

> **Note:** The bot is currently being migrated from Discord.js v11 to Discord.js v14. It is normal if some features are not fully functional during this process.

## Bot Description
This bot is designed to offer a wide range of functionalities for server management, moderation, fun, and user engagement. It supports server administrators with tools for controlling the environment, including moderation commands such as banning, muting, and purging messages. Additionally, it includes advanced features like automod, slowmode, and role management.

For users, the bot provides a variety of fun commands, such as generating memes, or even performing random actions like coin flips and dice rolls. It also features a leveling and rewards system to incentivize user participation, including commands for money transfers, bets, and profiles.

In addition to these features, the bot offers utility commands like server information, member counts, and customizable prefixes, giving server admins the control they need to manage their community effectively.

Whether you're running a Minecraft server, a Discord community, or any other platform, this bot is a powerful assistant that helps keep your server fun and organized.

Its production name in 2018/2019 was **Mister UwU** — it was on more than 80 servers and used daily by over 10,000 members.

### Features:
- **Moderation Commands** – The bot will help you to manage these commands: `ban`, `kick`, `hackban`, `softban`, `mute`, `unmute`, etc.
- **Antiraid** – Includes an antiraid system to protect your server from suspicious behavior or unwanted raids.
- **Auto Moderation** – Automatically deletes invites, suspicious links (like websites), and other harmful content.
- **Fun** – A lot of fun commands built just for your enjoyment (memes, coin flips, dice rolls, and more).
- **Roleplay** – Includes a few cool roleplay commands to make your server livelier.
- **Economy/Leveling** – Earn and gamble money, level up by sending messages, and build your reputation.
- **Music/Radio** – Play songs from YouTube. *(Currently under maintenance – please be patient!)*

### Future Updates:
Once updated and fully functional, this bot will not undergo further modifications. Currently, the bot does **not support `/commands`**, but this may be added in future releases.

It's an all-in-one solution for community engagement and server management, offering both essential and fun features for every server type.

## Commands

### Main Commands
- **botnick** - change the nick of the bot in your server.
- **help** - Bot will DM you a link with all of the commands.
- **ping** - Bot will respond with pong and time it took.
- **embed** [text] - Will send an embed with [text].
- **botinfo** - Will get all the bot's information.
- **hello** - Bot will answer "hello world".
- **reminder** [minutes] [text] - Will send you a reminder for [text] in [time].
- **invite/botinvite** - Will send you an invite for the bot.
- **serverinfo** - Will get the current server's info.
- **serveremojis** - Will get the server's emojis.
- **serverroles** - Will get the server's roles.
- **donate** - Will send you the donation link.
- **upvote** - Will send you the link to vote for the bot.
- **website** - Bot website.
- **settings** - Will give you the bot's settings on the server.
- **credits** - Will tell you who created the bot and the contributors.
- **dm** - Bot will DM the user with your message.
- **getchannels** - Bot will fetch the text/voice channel count.
- **membercount** - Bot will fetch the member/bot count.
- **prefix** - Will change the bot's prefix for the guild.
- **suggestion** - Can send a suggestion in the server and vote for it.
- **issue** [details] - Report an issue with the bot.
- **support** - Sends you the support link for the discord server.
- **uptime** - Gets the bot's uptime.
- **whois** @Someone - Gets the user's info.
- **mdn** [text] - Bot will search MDN (Mozilla Developer Network) for an answer.

#### Bot Owner Commands:
- **eval** [code] - Bot admin only.
- **exec** [task] - Bot admin only.
- **setgame** [newgame] - Bot admin only.
- **setstatus** [newstatu] - Bot admin only.
- **reload** - Bot admin only.
- **reboot** - Bot admin only.

---

### Moderation Commands
- **antijoin** [enable/disable] - The bot will kick every user that joins the server.
- **antiraid** [times]/[stop] - Will block everyone from sending messages in the channel.
- **reason** [case] [new reason] - Change the reason for a case. [not working].
- **report** @someone [reason] - Report the user [need reports channel].
- **ban** @Someone [reason] - Will ban that user from the server.
- **unban** @Someone [reason] - Will unban that user from the server.
- **softban** [ID] [reason] - Will ban then unban that user from the server.
- **hackban** [ID] [reason] - Will ban that ID/user from the server.
- **mute** @Someone [minutes] [reason] - Will mute that user from the server for the time.
- **unmute** @Someone [reason] - Will unmute that user from the server.
- **purge** [amount]/@Someone [reason/amount] - Will purge messages from the server/user.
- **clean** [amount] - Will delete the bot's messages.
- **roleinfo** [role] - Will give you the primary information on the role.
- **antiraid** [minutes] [reason] - Will disable the default role to send messages.
- **giverole** @Someone [rolename] - Will give a user the role you specified.
- **takerole** @Someone [rolename] - Will take the role you specified away from the user.
- **roleall** [rolename] - Will give all users the role you specified.
- **rroleall** [rolename] - Will take the role from all users that you specified.
- **slowmode** [seconds] - Will allow users to send a message every x seconds.
- **automod** [enable/disable] [automodtool] - Will turn on the bot's automoderation.
- **autorole** [rolename] - Will give the role specified when a user joins.
- **logs** [1/2/3] - Will give options to edit logs settings.
- **subscribe** [not working].

---

### Fun Commands
- **checkout** @someone - Will send an image of checking that user. [1/2 not working].
- **slap** @Someone - Will send an image of you slapping that user.
- **shit** @Someone - Will send an image of you stepping on that user.
- **buttslap** @Someone - Will send an image buttslapping that user. [NSFW].
- **rip** @Someone - Will send an image paying respects to that user.
- **trigger** @Someone - Will send an image of that user being triggered.
- **brazzers** @Someone - Will send an image with the brazzers logo on that user.
- **ohno** @Someone - Will send an image of ohno with the text you specified.
- **beautiful** @Someone - Will send an image of that user in a picture frame.
- **crush** @Someone - Will send an image having a crush on that user.
- **delete** @Someone - Will send an image deleting that user.
- **jail** @Someone - Will put the user behind bars.
- **thuglife** @Someone - Will put thuglife over a user's avatar.
- **rainbow** @Someone - Will put a rainbow over a user's avatar.
- **approved** @Someone - Will put approved over a user's avatar.
- **rejected** @Someone - Will put rejected over a user's avatar.
- **wasted** @Someone - Will put wasted over a user's avatar.
- **power** @Someone - Will put the user's avatar over the power character.
- **tattoo** @Someone - Will put the user's avatar as a tattoo.
- **8ball** [question] - Bot will respond with a random 8ball response.
- **coinflip** - Bot will respond with heads or tails.
- **cat** - Bot will send a random cat photo.
- **roll** [maxnumber] - Bot will roll the dice between 1 and max number.
- **achievement** [text] - Will send you a Minecraft achievement.
- **avatar** @Someone - Will get the user's avatar.
- **lizard** - Will send a random image with a lizard.
- **wallpaper** - Will send a random wallpaper image.
- **map** [city] - Show the map of the location. [not working].

---

### Level Commands
- **awards** - Bot will give you the reward list.
- **profile** @Someone - Get someone's profile.
- **deposit** [amount] - Will deposit [amount] into your bank.
- **withdraw** [amount] - Will withdraw [amount] from your bank. [5% fee].
- **redeem** [code] - Can redeem a code and get something in return for it.
- **transfer** @Someone [amount] - Allows you to transfer money to another user.
- **leaderboard** [cash/level] - Displays the top 10 in the guild.
- **25** [betamount] - Bet on the dice if it rolls above 25 win x1.25 of your bet.
- **50** [betamount] - Bet on the dice if it rolls above 50 win x1.50 of your bet.
- **75** [betamount] - Bet on the dice if it rolls above 75 win x1.75 of your bet.
- **99** [betamount] - Bet on the dice if it rolls above 99 win x2.00 of your bet.
- **roulette** [odd/even] [betamount] - Bet on roulette if you win get x1.25 your bet.
- **rob** @Someone - Can try to rob this user for up to 5,000 but don't get caught.
- **work** - Work for the day and earn some money. [cooldown: 10 mins].
- **hack** - Like work but you can make more money but can get a fine. [cooldown: 15 mins].
- **flipcoin** [bet] [heads/tails] - Just like coinflip but get to bet money on it.
- **givemoney** @Someone [amount] - Allows you to give money to a user.
- **takemoney** @Someone [amount] - Allows you to take money from that user.
- **givexp** @Someone [amount] - Allows you to give XP to a user.
- **takexp** @Someone [amount] - Allows you to take XP from a user.
- **profilesystem** - Allows you to enable/disable leveling/cash in your server.
