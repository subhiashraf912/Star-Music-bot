const { canModifyQueue } = require("../../util/EvobotUtil");

module.exports.config = {
  name: "skipto",
  aliases: ["st"],
  Description: "Skip to the selected queue number",
};
module.exports.run = async (bot, message, args, prefix) => {
  args.shift();
  if (!args.length)
    return message
      .reply(`Usage: ${prefix}${module.exports.config.name} <Queue Number>`)
      .catch(console.error);

  parseInt(args[0], 10);
  if (isNaN(args[0]))
    return message
      .reply(`Usage2: ${prefix} ${module.exports.config.name} <Queue Number>`)
      .catch(console.error);

  const queue = message.client.queue.get(message.guild.id);
  if (!queue)
    return message.channel.send("There is no queue.").catch(console.error);
  if (!canModifyQueue(message.member)) return;

  if (args[0] > queue.songs.length)
    return message
      .reply(`The queue is only ${queue.songs.length} songs long!`)
      .catch(console.error);

  queue.playing = true;
  if (queue.loop) {
    for (let i = 0; i < args[0] - 2; i++) {
      queue.songs.push(queue.songs.shift());
    }
  } else {
    queue.songs = queue.songs.slice(args[0] - 2);
  }
  queue.connection.dispatcher.end();
  queue.textChannel
    .send(`${message.author} ⏭ skipped ${args[0] - 1} songs`)
    .catch(console.error);
};
