const Discord = require("discord.js");
const db = require('../models/user');
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        const dbu = await db.findOne({ id: message.author.id });
        if(dbu.premium == false) return message.reply('You have no premium!');
        const auth = bot.users.cache.get(message.author.id);
        message.react('✉️')
        if(dbu.disabled) return auth.send('Error, Your widget was disabled.');
        const vanityUrl = args[0].toLowerCase();
        if(!vanityUrl) return message.reply('Please insert a vanity Url. (ex: wezacon)');
        const exists = await db.findOne({ vanity: vanityUrl });
        if(exists) return message.reply('This vanity is already taken.')
        const setVanity = await db.findOneAndUpdate({ id: message.author.id }, { vanity: vanityUrl });

        const embed = require('../utils/embed');
        embed(message, `${message.author.username} has updated their widget vanity.\n[${message.author.id}]`, bot, 'Widget Vanity', config.bot.moderation.entryLogging.channelLogId)

        return auth.send(`Your widget vanity has been updated to: \`${vanityUrl}\`, use \`${config.bot.prefix}embed\` to get the code!`);
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
    name: "vanity",
    aliases: []
}
