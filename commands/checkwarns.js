const Discord = require("discord.js");
const config = require("../config.json");
const mysql = require("mysql");
module.exports.run = async(bot, message, args, connection) => {

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permission to do this.");
    if (!args[0]) return message.reply("No user given.");
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.reply("I don't have the right permission to do this! (MANAGE_MESSAGES)");

    var checkedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

    if (!warnedUser) return message.reply("Can't find a user with that name.");
    if (warnedUser.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't warn this user.");

    connection.query(`SELECT warn_count AS warning_count, warn_reason AS warning_reason, warn_by AS warned_by FROM warnings WHERE guild_id=${message.guild.id} AND user_id=${checkedUser.id} ORDER BY warn_count ASC`, (err, result) => {
        if (!result[0]) return message.reply("This user doesn't have any warns.");
        var warnEmbed = new Discord.MessageEmbed()
            .setColor("4734db")
            .setTimestamp()
            .setDescription(`**Warnings** ${checkedUser}:`)
        result.forEach(r => {
            warnEmbed.addField(`**${r.warning_count}:**`, `Reason(s): ${r.warning_reason}\nWarned by: ${r.warned_by}`)
        });

        message.channel.send(warnEmbed);
    });
}

module.exports.help = {
    name: "checkwarns"
}