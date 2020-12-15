const Discord = require('discord.js');
const config = require('./config.json');
const colors = require('./colors.json');
const system = require('./system.json');
const fs = require('fs');
const bot = new Discord.Client();
var botStatus = config.bot.status.mode;
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
const { connect } = require('mongoose');
const package = require("./package.json");
const fetch = require("node-fetch");
const UserModel = require("./models/user");
const embed = require('./utils/embed');
require('dotenv').config({path: __dirname + '/.env'})
var oprix = config.bot.prefix;

var blackListMsgStatus = config.bot.moderation.blackListing.enabled;
var blackListMsg = config.bot.moderation.blackListing.errorMessage;
bot.on('ready', async () => {
    console.log('MAIN SHARD ONLINE\n-------------------------')
    if (config.bot.commandLogging == true) {
        console.log('Command logging is now enabled!\n-------------------------');
    } else {
        console.log('Command logging is not enabled!\n-------------------------')
    }
    if (config.bot.messageLogging == true) {
        console.log('Message logging is now enabled!');
    } else {
        console.log('Message logging is not enabled!')
    }
    console.log('----[DATA CONFIGURATING]----');
    await connect(process.env['MONGODB_URI'], {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log('FINISHED!')
    console.log('----[STARTING SHARDS]----')
    function StartShards() {
        fs.readdir("./commands/", (err, files) => {
            if (err) console.log(err);

            let jsfile = files.filter(f => f.split(".").pop() === "js")
            if (jsfile.length <= 0) {
                console.log("ERROR: There is not an existing [commands] folder OR there are no files in the [commands] folder!");
            }

            jsfile.forEach((f) => {
                let props = require(`./commands/${f}`);
                console.info(`[CMD]`, `[${f}] IS ONLINE`);
                bot.commands.set(props.help.name, props);
                props.help.aliases.forEach(alias => {
                    bot.aliases.set(alias, props.help.name);
                })
            })
        })

    }

    setTimeout(StartShards, 1000);
    setTimeout(async () => {
        setInterval(async () => {
            try {
                const allUserCount = await UserModel.find().exec();
                console.log(config.placeHolderText)
                if (config.bot.status.activity == "default") {
                    var botActivity = config.bot.prefix + "help" + " | " + allUserCount.length + " widgets";
                } else {
                    var botActivity = config.bot.status.activity;
                }
                bot.user.setPresence({ activity: { name: botActivity, type: "WATCHING" }, status: botStatus })
            } catch (error){
                console.log('[ERROR]', error.message)
            }
        }, 1000 * 10 * 6);

        const ready = [
            "╭─────────────────────────────────────────────╮",
            "│ ┌─────╮ ┌─────╮ ╭──────╮ ┌──────╮ ┌──┐ ┌──┐ │",
            "│ │ ╭─╮ │ │ ╭───╯ │ ╭──╮ │ │ ┌──╮ │ │  │ │  │ │",
            "│ │ ╰─╯ │ │ ╰──╮  │ ╰──╯ │ │ │  │ │ │  ╰─╯  │ │",
            "│ │    ─┤ │ ╭──╯  │ ╭──╮ │ │ │  │ │ ╰──╮ ╭──╯ │",
            "│ │ ├─╮ │ │ ╰───╮ │ │  │ │ │ └──╯ │    │ │    │",
            "│ └─╯ ╰─╯ └─────╯ └─┘  └─┘ └──────╯    └─┘    │",
            "╰─────────────────────────────────────────────╯"
        ];
        console.log("[EVENT] The bot is now");
        for(const str of ready) {
            console.log(str);
        }
    }, 2000);
})

bot.on("message", async message => {
    if (message.channel.type === "dm") return;
    if (message.author.bot) return;
    if(message.member.hasPermission("BAN_MEMBERS")){
        var hasPerms = true;
    } else {
        var hasPerms = false;
    }
    const guild = message.guild;
    const author = message.author;
    var serverIcon = guild.iconURL({ format: 'webp', dynamic: true });
    const GO = message.guild.owner;
    var messageAuthor = message.member.user.tag;
    var AuthorImage = message.author.avatarURL({ dynamic: true });
    const getUser = bot.users.cache.get(author.id);
    const exists = await UserModel.findOne({ id: author.id });
    console.log(exists)
    if(!exists){
        const newUser = new UserModel({ id: author.id });
        await newUser.save();
        message.react('✉️')
        getUser.send(`Hello ${author.username}! I have created an embed for you which you can put on any website you want to show off your discord profile!\nUse the following code on any website:\n\n\`\`\`html\n <iframe src="${config.siteUrl}/${message.author.id}" width="500" height="335" style="border-radius: 20px; border: none;"></iframe>\n\`\`\``)
        embed('', `[${author.user.tag}] has their widget created.\n[${auhtor.id}]`, bot, 'Widget Creation', config.bot.moderation.entryLogging.channelLogId)
    }

    if (config.bot.messageLogging == true) { console.log('ML -> [' + message.guild.name + '] -> ' + messageAuthor + ': ' + message.content) }

    if (!message.content.startsWith(oprix)) return;
    // COMMAND HANDLER

    let args = message.content.slice(oprix.length).trim().split(/ +/g);
    let cmd;
    cmd = args.shift().toLocaleLowerCase();
    let commandfile = bot.commands.get(cmd.slice(oprix.length));
    if (commandfile) commandfile.run(bot, message, args, active);
    if (config.bot.commandLogging == true) { console.log('CL -> ' + message.content + ' command used in: [' + message.guild.name + '] - By: ' + messageAuthor) }
    // if (bot.commands.has(cmd)) {
    command = bot.commands.get(cmd);
    // } 

    // else if (bot.aliases.has(cmd)) {
    //     command = bot.commands.get(bot.aliases.get(cmd));
    // }
    try {
        command.run(bot, message, args);
    } catch (e) {
        return;
    }
})

bot.on("guildMemberRemove", async member => {

    embed('', `[${member.id}] has their widget deactivated.`, bot, 'Widget Deactivation', config.bot.moderation.entryLogging.channelLogId)

    if(member.bot) return;
    const um = UserModel.findOne({ id: member.id })
    if(um.disabled == true) return;
    const deleteUser = await UserModel.findOneAndUpdate({ id: member.id }, { deactivated: true })
    console.log('[DEACTIVATED]', member.id)
});

module.exports = {
    bot: bot
}
bot.login(process.env['BOT_TOKEN']);