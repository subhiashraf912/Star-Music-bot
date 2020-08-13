const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports.config = {
  name: "lyrics",
  aliases: ["ly"],
  Description: "Get lyrics for the currently playing song",
};
module.exports.run = async (bot, message, args, prefix) => {
  const queue = bot.queue.get(message.guild.id);
  if (!queue)
    return message.channel
      .send("There is nothing playing.")
      .catch(console.error);

  let lyrics = null;

  try {
    lyrics = await lyricsFinder(queue.songs[0].title, "");
    if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
  } catch (error) {
    lyrics = `No lyrics found for ${queue.songs[0].title}.`;
  }

  let lyricsEmbed = new MessageEmbed()
    .setTitle("Lyrics")
    .setDescription(lyrics)
    .setColor("#F8AA2A")
    .setTimestamp();

  if (lyricsEmbed.description.length >= 2048)
    lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
  return message.channel.send(lyricsEmbed).catch(console.error);
};
