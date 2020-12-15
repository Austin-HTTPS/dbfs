const Discord = require("discord.js");
const db = require('../models/user');
const { connect } = require('mongoose');
const config = require('../config.json');
module.exports.run = async (bot, message, args) => {
    try {
        // if(!message.guild.id == config.bot.moderation.server.id) return;
        // if(!message.member.roles.cache.has(config.bot.moderation.server.adminRoleId)) return;
        const target = args[0];
        if(!target) return message.reply('Please include a User id.')
        const dbu = await db.findOne({ id: target });
        const auth = bot.users.cache.get(target);
        if(!auth) return message.reply('User not found in the server.');
        if(!dbu) return message.reply('User not found in the database.');
        message.react('✉️')
        if(dbu.disabled) {
            var state = false;
        } else {
            var state = true;
        }
        if(dbu.deactivated) {
            var stateDeact = true;
        } else {
            var stateDeact = true;
        }
        const disen = await db.findOneAndUpdate({ id: target }, { deactivated: stateDeact, disabled: state });

        const embed = require('../utils/embed');
        if(dbu.disabled){
            var endem = 'enabled';
        }else{
            var endem = 'disabled';
        }
        message.reply(`The ${endem} widget owner has received a DM.`);
        console.log('[WIDGET DISABLED]', `${auth.username} has had their widget ${endem}.\n[${auth.id}]`)
        embed(message, `${auth.username} has had their widget ${endem}.\n[${auth.id}]`, bot, `Widget ${endem}`, config.bot.moderation.entryLogging.channelLogId)

        return auth.send(`Your widget has been ${endem}! By: ${message.author.username}`);
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
    name: "disable",
    aliases: []
}
