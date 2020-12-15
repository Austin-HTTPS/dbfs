const fs = require('fs');
const { MessageEmbed } = require('discord.js')

module.exports = async function newEmbed(msg, content, bot, title, channelId) {
    const logc = bot.channels.cache.get(channelId);
    var embed = new MessageEmbed();
    embed.setTitle(title)
    if(msg !== '') embed.setAuthor(msg.author.tag, msg.author.displayAvatarURL());
    embed.setDescription(content)
    embed.setTimestamp()
    embed.setColor('#1dda8f')
    embed.setFooter("© Wezacon.com");
    logc.send(embed)
};
