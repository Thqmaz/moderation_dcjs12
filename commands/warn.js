const Discord = require("discord.js");
const config = require("../config.json");
const mysql = require("mysql");
module.exports.run = async(bot, message, args, connection) => {

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permission to do this.");
    if (!args[0]) return message.reply("No user given.");
    if (!args[1]) return message.reply("No reason(s) given.");
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.reply("I don't have the right permission to do this! (MANAGE_MESSAGES)");

    var warnedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    var reason = args.slice(1).join(" ");

    if (!warnedUser) return message.reply("Can't find a user with that name.");
    if (warnedUser.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't warn this user.");

    connection.query(`SELECT warn_count AS warning_count FROM warnings WHERE guild_id=${message.guild.id} AND user_id=${warnedUser.id} ORDER BY warn_count DESC LIMIT 1`, (err, result) => {
        if (!result[0]) {
            connection.query(`INSERT INTO warnings (guild_id, user_id, warn_count, warn_reason) VALUES (${message.guild.id}, ${warnedUser.id}, 1, '${reason}')`);

            var warnEmbed = new Discord.MessageEmbed()
                .setColor("4734db")
                .setTimestamp()
                .setDescription(`**Warned user:** ${warnedUser} (${warnedUser.id})
                                **Warned by:** ${message.author} (${message.author.id})
                                **Reason(s):** ${reason}`)
                .addField(`**Warning count:**`, `1`)

            message.channel.send(warnEmbed);
        } else {
            totalWarns = result[0].warning_count++;
            connection.query(`INSERT INTO warnings (guild_id, user_id, warn_count, warn_reason, warn_by) VALUES (${message.guild.id}, ${warnedUser.id}, ${totalWarns+1}, '${reason}', '${message.member.user.tag}')`);

            var warnEmbed = new Discord.MessageEmbed()
                .setColor("4734db")
                .setTimestamp()
                .setDescription(`**Warned user:** ${warnedUser} (${warnedUser.id})
                                **Warned by:** ${message.author} (${message.author.id})
                                **Reason(s):** ${reason}`)
                .addField(`**Warning count:**`, `${result[0].warning_count}`)

            message.channel.send(warnEmbed);
        }
    });
}

module.exports.help = {
    name: "warn"
}