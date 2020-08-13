const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");

module.exports.config = {
  name: "queue",
  aliases: ["q"],
  description: "Show the music queue and now playing.",
};
module.exports.run = async (bot, message, args, prefix) => {
  const queue = message.client.queue.get(message.guild.id);
  if (!queue)
    return message.reply("There is nothing playing.").catch(console.error);

  const description = queue.songs.map(
    (song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`
  );

  let queueEmbed = new MessageEmbed()
    .setTitle("Music Queue")
    .setDescription(description)
    .setColor("#F8AA2A");

  const splitDescription = splitMessage(description, {
    maxLength: 2048,
    char: "\n",
    prepend: "",
    append: "",
  });

  splitDescription.forEach(async (m) => {
    queueEmbed.setDescription(m);
    message.channel.send(queueEmbed);
  });
};
