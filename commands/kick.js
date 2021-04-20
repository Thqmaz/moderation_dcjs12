const Discord = require("discord.js");
const config = require("../config.json");
module.exports.run = async(bot, message, args) => {
    if (!message.member.hasPermission("KICK_MEMBERS")) return;
    if (!args[0]) return message.reply("No user given.");
    if (message.mentions.members.first()) {
        message.guild.member(message.mentions.members.first()).kick().then((member) => {
            message.channel.send(`:wave: **${member.displayName}** has been kicked! :point_right: `);
        }).catch(() => {
            message.channel.send("I don't have the right permission to do this!");
        });
    }
}

module.exports.help = {
    name: "kick"
}