const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: false });
bot.commands = new Discord.Collection();
const config = require("./config.json");
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'moderation',
    charset: 'utf8mb4'
});

let prefix = config.prefix;

fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);
    var cmdFiles = files.filter(f => f.split(".").pop() === "js");

    if (cmdFiles.length <= 0) return console.log("No commands found.");

    cmdFiles.forEach((f, i) => {
        var fileGet = require(`./commands/${f}`);
        console.log(`- ${f}`);

        bot.commands.set(fileGet.help.name, fileGet);
    })

})

bot.on("ready", async() => {
    console.log('\x1b[32m%s\x1b[5m', `${bot.user.username} is now online on ${bot.guilds.cache.size} guilds.`)
    bot.user.setStatus('online')
});

bot.on("message", async message => {
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;

    let msgArray = message.content.split(" ");
    let command = msgArray[0];
    let args = msgArray.slice(1);
    if (!command.startsWith(prefix)) return;

    if (bot.commands.get(command.slice(prefix.length))) {
        let cmd = bot.commands.get(command.slice(prefix.length));
        if (cmd) {
            cmd.run(bot, message, args, connection, prefix)
        }
    }

});

bot.login(config.token);