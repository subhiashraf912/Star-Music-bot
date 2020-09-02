// require packages
const Discord = require("discord.js");
const fs = require("fs").promises;
require("dotenv/config");
const path = require("path");
// initialise are bot
const bot = new Discord.Client();
bot.commands = new Map();
bot.aliases = new Map();
bot.queue = new Map();

const prefix = process.env.prefix;
const owner = process.env.owner;
const token = process.env.BOT_TOKEN;

let readevents = (dir) => {
  fs.readdir(path.join(__dirname, dir)).then((files) => {
    files.forEach((file) => {
      if (!file.endsWith(".js")) return;

      let eventName = file.substring(0, file.indexOf(".js"));
      let eventModule = require(path.join(__dirname, dir, eventName));

      console.log(`${eventName} event has been loaded...`);
      bot.on(eventName, eventModule.bind(null, bot));
    });
  });
};

// bot.on('channelDelete')
// bot.on('channelDelete')
// bot.on('channelUpdate')
// bot.on('guildBanAdd')
// bot.on('guildBanRemove')
// bot.on('guildDelete')
// bot.on('messageDelete')
// bot.on('messageReactionAdd')
// bot.on('messageReactionRemove')
// bot.on('messageUpdate')
// bot.on('roleCreate')
// bot.on('roleDelete')
// bot.on('roleUpdate')
// bot.on('warn')
//commandhandler
let readcommands = (dir) => {
  fs.readdir(path.join(__dirname, dir)).then((files) => {
    files.forEach((file) => {
      if (!file.endsWith(".js")) return;
      let cmdName = file.substring(0, file.indexOf(".js"));
      let cmdModule = require(path.join(__dirname, dir, cmdName));
      bot.commands.set(cmdModule.config.name, cmdModule);

      if (cmdModule.config.aliases)
        for (const alias of cmdModule.config.aliases) {
          bot.aliases.set(alias, cmdModule);
        }
      console.log("------------------------------------");
      // console.log(bot.aliases);

      console.log(`${cmdName} has been loaded...`);
    });
  });
};
readevents("events");

readcommands("cmds");
readcommands("cmds/music");
readcommands("cmds/anime");
readcommands("cmds/moderation");

readcommands("cmds/utility");

// Bot login
bot.login(token);
bot.on("error", (err) => {
  let aze = bot.users.cache.find((user) => user.id == "507684120739184640");

  aze.send(`ERR HAPPEND: ${err.message}`);
});
