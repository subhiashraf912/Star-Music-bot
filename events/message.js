const random = require("random.js");
module.exports = (bot, msg) => {
  let fetchedData;
  msgcontent = msg.content.toLowerCase();

  prefix = process.env.prefix;
  if (!msgcontent.startsWith(prefix)) return;

  const args = msgcontent.slice(prefix.length).trim().split(/ +/g);
  const cmdName = args[0];
  const cmdModule =
    bot.commands.get(cmdName.toLowerCase()) ||
    bot.aliases.get(cmdName.toLowerCase());

  if (!cmdModule) return;
  cmdModule.run(bot, msg, args, prefix);
};
