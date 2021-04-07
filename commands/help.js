const Discord = require("discord.js");
const config = require('../config.json');
const color = require('../colors.json');
const pack = require('../package.json');
module.exports.run = async (bot, message, args) => {
    try {
        message.reply("->\n`?bio`\n`?embed`\n`?activate`\n`?vanity`\n\n**Developer Options**\n`?apikey`")
    } catch (error) {
        const c = require("../colors.json");
        const Err_1 = new Discord.MessageEmbed()
            .setColor(c.error)
            .setTitle("**Error**")
            .setDescription("I have encountered a unexpected error: `"+ error.message +"`\nplease report this to: https://dbos.flarum.cloud or https://github.com/wezacon/dbos")
        return message.channel.send(Err_1);
    }

}

module.exports.help = {
    name: "help",
    aliases: ["vc"]
}