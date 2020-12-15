const Cookies = require("cookies");
const express = require("express");
const fs = require("fs");
var Client = require("uptime-robot");
const cookieParser = require('cookie-parser');
const config = require("./config.json");
const app = express();
var varPORT = config.port || 3000;
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(Cookies.express());
app.use(cookieParser());
if(config.server.invite == ''){
  console.log('ERROR -> You need to input a server invite code, example: TJY6Xyg\nStopping process.');
  process.exit(1);
} else if(config.siteUrl == ''){
  console.log('ERROR -> You need to input a site url, example: https://localhost\nStopping process.');
  process.exit(1);
} else if(config.bot.id == ''){
  console.log('ERROR -> You need to input a bot id, example: 668843307329126410\nStopping process.');
  process.exit(1);
} else if(config.bot.prefix == ''){
  console.log('ERROR -> You need to input a prefix, example: !\nStopping process.');
  process.exit(1);
} else if(config.bot.token == ''){
  console.log('ERROR -> You need to input a bot token, example: NzUzMjc0MTU1MjgxMTU0MTY4.X1jzOQ.RwEgbwp5a_2svPcUijU6wrAY9Dg\nStopping process.');
  process.exit(1);
} else {
  const discordBot = require("./bot");
  setInterval(
  () =>
    require("node-fetch")(config.siteUrl).then(() =>
      console.log("Pinged website....")
    ),
  4 * 60 * 1000
);
app.use(require("./routes/api.js"));
app.use(require("./routes/guides"));
const listener = app.listen(varPORT, function() {
  console.log("Site online on the address: " + config.siteUrl + ":" + varPORT + "\n-------------------------");
});
}

