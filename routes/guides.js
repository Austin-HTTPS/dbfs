const express = require("express");
const router = express.Router();
const discordBot = require("../bot");
const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require('../config.json');
const app = express();
require('dotenv').config({path: __dirname + '/.env'})
app.set('view engine', 'ejs');
const UserModel = require("../models/user");

router.get("/u/:id", async function(req, res) {
  const UID = req.params.id;
  try {
    const db = await UserModel.findOne({ $or: [ {id: UID }, {vanity: UID} ] });

    const user = await bot.users.cache.get(db.id);

    if(!user){
      let data = {
        code: 404,
        message: "Bot could not find the user."
      }
      return res.render("../views/error.ejs", data);
    }
    if(!db){
      let data = {
        code: 404,
        message: "User not found in the database."
      }
      return res.render("../views/error.ejs", data);
    }
    if(db.disabled){
      let data = {
        code: 410,
        message: "User was disabled by Team Wezacon"
      }
      return res.render("../views/error.ejs", data);
    }
    if(db.deactivated){
      let data = {
        code: 410,
        message: "This widget is deactivated, if you are this user then use <strong>" + config.bot.prefix + "activate</strong> on the <a href='https://dbsl.ga/s/761891076834852884' style='color: var(--primary);' target='_blank'>support server</a> to enable your widget."
      }
      return res.render("../views/error.ejs", data);
    }
    const wcount = await UserModel.find().exec();
    const brave = (await user.fetchFlags()).has("HOUSE_BRAVERY");
    const balance = (await user.fetchFlags()).has("HOUSE_BALANCE")
    const brill = (await user.fetchFlags()).has("HOUSE_BRILLIANCE")
    const events = (await user.fetchFlags()).has("HYPESQUAD_EVENTS")
    const developer = (await user.fetchFlags()).has("VERIFIED_DEVELOPER")
    const bug1 = (await user.fetchFlags()).has("BUGHUNTER_LEVEL_1")
    const bug2 = (await user.fetchFlags()).has("BUGHUNTER_LEVEL_2")
    const team = (await user.fetchFlags()).has("DISCORD_EMPLOYEE");
    const partner = (await user.fetchFlags()).has("DISCORD_PARTNER")
    const supporter = (await user.fetchFlags()).has("EARLY_SUPPORTER")
    let data = {
      user,
      db: db,
      team,
      partner,
      supporter,
      developer,
      events,
      bug1,
      bug2,
      brave,
      balance,
      brill,
      widgets: wcount.length,
      SiteName: config.siteName
    }
    return res.render("../views/index.ejs", data);
  } catch (error) {
    let data = {
      code: "WZC-1",
      message: "Unknown error."
    }
    return res.render("../views/error.ejs", data);
  }
});

router.get("/support", function(request, response) {
  response.redirect("https://dbsl.ga/s/761891076834852884");
});

router.get("/tos", async (req, res) => {
  let data = {
    icon: config.iconUrl,
    SiteName: config.siteName
  }
  res.render("../views/wzc/tos.ejs", data);
});


// if 404
router.get("*", function(req, res) {
  let data = {
    code: 404,
    message: "Page not found."
  }
  res.render("../views/error.ejs", data);
});

bot.login(process.env['BOT_TOKEN'])
console.log('------------[ACTIVATING]-------------\nSHARD: guides.js ONLINE - This is a standalone shard!\n-------------------------')
module.exports = router;