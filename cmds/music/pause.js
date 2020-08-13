const { canModifyQueue } = require("../../util/EvobotUtil");

module.exports.config = {
  name: "pause",
  aliases: ["pa"],
  Description: "Pause the currently playing music",
};
module.exports.run = async (bot, message, args, prefix) => {
  const queue = bot.queue.get(message.guild.id);
  if (!queue)
    return message.reply("There is nothing playing.").catch(console.error);
  if (!canModifyQueue(message.member)) return;

  if (queue.playing) {
    queue.playing = false;
    queue.connection.dispatcher.pause(true);
    return queue.textChannel
      .send(`${message.author} ⏸ paused the music.`)
      .catch(console.error);
  }
};
