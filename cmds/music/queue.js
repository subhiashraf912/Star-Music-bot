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

  let currentPage = 0;
  const embeds = generateQueueEmbed(queue.songs);
  const queueEmbed = await message.channel.send(
    `Current Page:${currentPage + 1}/${embeds.length}`,
    embeds[currentPage]
  );
  await queueEmbed.react("⬅️");
  await queueEmbed.react("➡️");
  await queueEmbed.react("❌");

  const filter = (reaction, user) =>
    ["⬅️", "➡️", "❌"].includes(reaction.emoji.name) &&
    message.author.id == user.id;
  const collector = queueEmbed.createReactionCollector(filter);
  collector.on("collect", async (reaction, user) => {
    //if there are 2 embds
    if (reaction.emoji.name === "➡️") {
      reaction.users.remove(user.id);
      if (currentPage < embeds.length - 1) {
        currentPage++;
        queueEmbed.edit(
          `**Current Page:** \`${currentPage + 1}/${embeds.length}\``,
          embeds[currentPage]
        );
      }
    } else if (reaction.emoji.name === "⬅️") {
      reaction.users.remove(user.id);
      if (currentPage === 0) return;
      --currentPage;
      queueEmbed.edit(
        `**Current Page:** \`${currentPage + 1}/${embeds.length}\``,
        embeds[currentPage]
      );
    } else {
      collector.stop();
      await queueEmbed.delete();
    }
  });
};

function generateQueueEmbed(queue) {
  const embeds = [];
  let k = 10;
  for (let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;
    const info = current
      .map((track) => `**${++j}-** \`${track.title}\``)
      .join(`\n`);
    const embed = new MessageEmbed().setDescription(
      `**Current Song:** \`${queue[0].title}\`\n\n${info}`
    );
    embeds.push(embed);
  }
  return embeds;
}
