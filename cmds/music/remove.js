const { canModifyQueue } = require("../../util/EvobotUtil");

module.exports.config = {
  name: "remove",
  aliases: ["rv"],
  Description: "Remove song from the queue",
};
module.exports.run = async (bot, message, args, prefix) => {
  args.shift();
  const queue = message.client.queue.get(message.guild.id);
  if (!queue)
    return message.channel.send("There is no queue.").catch(console.error);
  if (!canModifyQueue(message.member)) return;

  if (!args.length)
    return message.reply(`Usage: ${prefix} remove <Queue Number>`);
  if (isNaN(args[0]))
    return message.reply(`Usage: ${prefix} remove <Queue Number>`);

  const song = queue.songs.splice(args[0] - 1, 1);
  queue.textChannel.send(
    `${message.author} ❌ removed **${song[0].title}** from the queue.`
  );
};
