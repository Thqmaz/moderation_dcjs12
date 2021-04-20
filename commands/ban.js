const Discord = require("discord.js");
const config = require("../config.json");
module.exports.run = async(bot, message, args) => {
    if (!message.member.hasPermission("BAN_MEMBERS")) return;
    if (!args[0]) return message.reply("No user given.");
    if (message.mentions.members.first()) {
        message.guild.member(message.mentions.members.first()).ban().then((member) => {
            message.channel.send(`:wave: **${member.displayName}** has been banned! :point_right: `);
        }).catch(() => {
            message.channel.send("I don't have the right permission to do this!");
        });
    }
}

module.exports.help = {
    name: "ban"
}