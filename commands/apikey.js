const Discord = require("discord.js");
const db = require('../models/user');
const { connect } = require('mongoose');
const config = require('../config.json');
const randomNumGen1 = Date.now();
const randomNumGen2 = Math.floor(Math.random() * 101);
const KEY = randomNumGen1 + randomNumGen2;
module.exports.run = async (bot, message, args) => {
    try {
        const dbu = await db.findOne({ id: message.author.id });
        const auth = bot.users.cache.get(message.author.id);
        message.react('✉️')
        if(dbu.disabled) return auth.send('Your widget was disabled.');
        var update = await db.findOneAndUpdate({ id: message.author.id }, { apiKey: KEY }, {new: true});
        console.log('[API KEY]', 'Created for ' + message.author.id)
        return auth.send(`Hey! This is your API key:\n||${KEY}||\n:warning: **Do not share this with anyone!**`);
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
    name: "apikey",
    aliases: []
}
