const express = require("express");
const router = express.Router();
const config = require('../config.json');
const Discord = require("discord.js");
const bot = new Discord.Client();
const UserModel = require("../models/user");
const pkg = require("../package.json");

router.get('/api/versions', async (req, res) =>{
  let data = {
    bot: config.bot.ver,
    site: pkg.version
  }
  res.status(200).json({
    versions
  })
})

router.get('/api/s/:gid', async function(req, res){
    const guildid = req.params.gid;
    const guild = await UserModel.findOne({ id: guildid }).exec();
    if(!guildid){
      res.status(404).json({
        code: 404,
        message: "Unknown guild id"
      })
    }
    if(!guild) {
      res.status(404).json({
        code: 404,
        message: "Guild not found"
      })
    }
    if(guild.blacklisted == true){
      res.status(401).json({
        code: 401,
        message: "This guild was blacklisted"
      })      
    }
    res.status(200).json({
      guild
    })
});


console.log('------------[ACTIVATING]-------------\nSHARD: api.js ONLINE - This is a standalone shard!\n-------------------------')
module.exports = router;