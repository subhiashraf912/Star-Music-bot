const { canModifyQueue } = require("../../util/EvobotUtil");
module.exports.config = {
  name: "loop",
  aliases: ["l"],
  usage: "<Prefix> loop",
  Description: "Toggle music loop",
};

module.exports.run = async (bot, message, args, prefix) => {
  const queue = bot.queue.get(message.guild.id);
  if (!queue)
    return message.reply("There is nothing playing.").catch(console.error);
  if (!canModifyQueue(message.member)) return;

  // toggle from false to true and reverse
  queue.loop = !queue.loop;
  return queue.textChannel
    .send(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)
    .catch(console.error);
};
