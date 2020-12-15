const Discord = require("discord.js");
const db = require('../models/user');
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        const dbu = await db.findOne({ id: message.author.id });
        const auth = bot.users.cache.get(message.author.id);
        message.react('✉️')
        if(dbu.disabled) return auth.send('Your widget was disabled.');
        if(!dbu.deactivated) return auth.send('Your widget is already active.');

        const updateBio = await db.findOneAndUpdate({ id: message.author.id }, { deactivated: false });

        const embed = require('../utils/embed');
        embed(message, `${message.author.username} has activated their widget.\n[${message.author.id}]`, bot, 'Widget Activation', config.bot.moderation.entryLogging.channelLogId)

        return auth.send(`Your widget has been activated, use \`${config.bot.prefix}embed\` to get the code!`);
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
    name: "activate",
    aliases: []
}
