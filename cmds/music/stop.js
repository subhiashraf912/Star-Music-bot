const { canModifyQueue } = require("../../util/EvobotUtil");

module.exports.config = {
  name: "stop",
  aliases: ["leave", "end", "disconnect", "dc"],
  Description: "Stops the music",
};
module.exports.run = async (bot, message, args, prefix) => {
  const queue = message.client.queue.get(message.guild.id);

  if (!queue)
    return message.reply("There is nothing playing.").catch(console.error);
  if (!canModifyQueue(message.member)) return;

  queue.songs = [];
  queue.connection.dispatcher.end();
  queue.textChannel
    .send(`${message.author} ⏹ stopped the music!`)
    .catch(console.error);
};
