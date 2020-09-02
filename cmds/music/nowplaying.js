const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
module.exports.config = {
  name: "nowplaying",
  aliases: ["np"],
  Description: "Show now playing song",
};
module.exports.run = async (bot, message, args, db, prefix) => {
  const queue = bot.queue.get(message.guild.id);
  if (!queue)
    return message.reply("There is nothing playing.").catch(console.error);
  const song = queue.songs[0];
  let duration = (await ytdl.getInfo(song.url)).videoDetails.lengthSeconds;

  const seek =
    (queue.connection.dispatcher.streamTime -
      queue.connection.dispatcher.pausedTime) /
    1000;
  const left = duration - seek;
  let nowPlaying = new MessageEmbed()
    .setTitle("Now playing")
    .setDescription(`${song.title}\n${song.url}`)
    .setColor("#F8AA2A")
    .setAuthor("Sen")
    .addField(
      "\u200b",
      new Date(seek * 1000).toISOString().substr(11, 8) +
        "[" +
        createBar(duration == 0 ? seek : duration, seek, 20)[0] +
        "]" +
        (duration == 0
          ? " ◉ LIVE"
          : new Date(duration * 1000).toISOString().substr(11, 8)),
      false
    );

  if (duration > 0)
    nowPlaying.setFooter(
      "Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8)
    );

  return message.channel.send(nowPlaying);
};
