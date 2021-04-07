const Discord = require("discord.js");
const config = require('../config.json');
const color = require('../colors.json');
const pack = require('../package.json');
const db = require('../models/user');
module.exports.run = async (bot, message, args) => {
    try {
        const author = await bot.users.cache.get(message.author.id);
        const data = await db.findOne({ id: message.author.id });
        console.log(data.vanity)
        if(data.vanity === null){
            var end = message.author.id;
        } else {
            var end = data.vanity;
        }
        message.react('✉️')
        author.send(`Please put the following code on a website that you own!\n\`\`\`html\n <iframe src="${config.siteUrl}/u/${end}" width="500" height="335" style="border-radius: 20px; border: none;"></iframe>\n\`\`\``)
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
    name: "embed",
    aliases: ["vc"]
}