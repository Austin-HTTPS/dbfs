const express = require("express");
const router = express.Router();
const config = require('../config.json');
const Discord = require("discord.js");
const bot = new Discord.Client();
const UserModel = require("../models/user");
const pkg = require("../package.json");
require('dotenv').config()

router.get('/api/versions', async (req, res) => {
  let data = {
    bot: config.bot.ver,
    site: pkg.version
  }
  return res.status(200).json({
    versions
  })
})

router.get('/api/u/:id/key/:apiKey', async function (req, res) {
  const UID = req.params.id;
  const entryKey = req.params.apiKey;
  try {
    const db = await UserModel.findOne({ $or: [{ id: UID }, { vanity: UID }], apiKey: entryKey });

    if (db.apiKey == null || db.apiKey == undefined) {
      let data = {
        code: 401,
        message: "API key does not match this user."
      }
      return res.status(data.code).json({
        data
      })
    }

    const user = await bot.users.cache.get(db.id);

    if (!user) {
      let data = {
        code: 404,
        message: "Bot could not find the user."
      }
      return res.status(data.code).json({
        data
      })
    }
    if (!db) {
      let data = {
        code: 404,
        message: "User not found in the database."
      }
      return res.status(data.code).json({
        data
      })
    }
    if (db.disabled) {
      let data = {
        code: 410,
        message: "User was disabled by Team Wezacon"
      }
      return res.status(data.code).json({
        data
      })
    }
    if (db.deactivated) {
      let data = {
        code: 410,
        message: "This widget is deactivated, if you are this user then use <strong>" + config.bot.prefix + "activate</strong> on the <a href='https://dbsl.ga/s/761891076834852884' style='color: var(--primary);' target='_blank'>support server</a> to enable your widget."
      }
      return res.status(data.code).json({
        data
      })
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
    console.log(db.apiKey)

    let data = {
      user,
      db,
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
    // delete data.db.apiKey
    return res.status(200).json({
      data
    })
  } catch (error) {
    let data = {
      code: "WZC-1",
      message: error.message
    }
    return res.status(201).json({
      data
    })
  }
});


console.log('------------[ACTIVATING]-------------\nSHARD: api.js ONLINE - This is a standalone shard!\n-------------------------')
bot.login(process.env['BOT_TOKEN'])
module.exports = router;