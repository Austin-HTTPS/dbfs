const Discord = require("discord.js");
const BlogModel = require('../models/user');
const { connect } = require('mongoose');
const config = require('../config.json');
const Autolinker = require('autolinker');


module.exports.run = async (bot, message, args) => {
    try {
        const wuyf = await BlogModel.findOne({ id: message.author.id });
        if(wuyf.disabled) return auth.send('Error, Your widget was disabled.');
        if(!args.length) return message.reply('You didn\'t provide content.');
        if(args.length > 400) return message.reply('Error, You can\'t have more than `400` words.');

        const desc = args.join(" ");
        function nl2br(str){
            return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
        }
        const desc1 = desc.replace(/<[^>]+>/g, '');
        const precontent = nl2br(desc1);
        var content = Autolinker.link(precontent);

        const updateBio = await BlogModel.findOneAndUpdate({ id: message.author.id }, { bio: content });
        const embed = require('../utils/embed');
        embed(message, `${message.author.username} has updated their bio.\n[${message.author.id}]`, bot, 'Bio Update', config.bot.moderation.entryLogging.channelLogId)

        message.reply(`Your bio has been set!`)
            .then(x => {
                x.delete({ timeout: 4000 })
            })
        return message.delete({ timeout: 4000 })
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
    name: "bio",
    aliases: []
}
