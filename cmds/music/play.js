const { play } = require("../../include/play");
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = require("soundcloud-downloader");

module.exports.config = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  Description: "Plays audio from YouTube or Soundcloud",
};
module.exports.run = async (bot, message, args, prefix, choice) => {
  let argsForPlay;
  if (message.content) argsForPlay = message.content.split(" ");
  else if (choice) argsForPlay = `?play ${choice}`;
  argsForPlay.shift();
  args.shift();
  const { channel } = message.member.voice;

  const serverQueue = message.client.queue.get(message.guild.id);
  if (!channel)
    return message
      .reply("You need to join a voice channel first!")
      .catch(console.error);
  if (serverQueue && channel !== message.guild.me.voice.channel)
    return message
      .reply(`You must be in the same channel as ${message.client.user}`)
      .catch(console.error);
  console.log(argsForPlay);
  if (!argsForPlay.length)
    return message
      .reply(`Usage: ${prefix}play <YouTube URL | Video Name |`)
      .catch(console.error);

  const permissions = channel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT"))
    return message.reply(
      "Cannot connect to voice channel, missing permissions"
    );
  if (!permissions.has("SPEAK"))
    return message.reply(
      "I cannot speak in this voice channel, make sure I have the proper permissions!"
    );

  const search = argsForPlay.join(" ");
  const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
  const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
  const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
  const url = argsForPlay[0];
  const urlValid = videoPattern.test(argsForPlay[0]);

  // Start the playlist if playlist url was provided
  if (
    !videoPattern.test(argsForPlay[0]) &&
    playlistPattern.test(argsForPlay[0])
  ) {
    const cmdModule =
      bot.commands.get("playlist".toLowerCase()) ||
      bot.aliases.get("pl".toLowerCase());
    return cmdModule.run(bot, message, argsForPlay, prefix);
  }

  const queueConstruct = {
    textChannel: message.channel,
    channel,
    connection: null,
    songs: [],
    loop: false,
    volume: 100,
    playing: true,
  };

  let songInfo = null;
  let song = null;

  if (urlValid) {
    try {
      console.log(url);
      songInfo = await ytdl.getInfo(url);
      song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        duration: songInfo.videoDetails.lengthSeconds,
      }; //
    } catch (error) {
      console.error(error);
      return message.reply(error.message).catch(console.error);
    }
  } else if (scRegex.test(url)) {
    try {
      const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
      song = {
        title: trackInfo.title,
        url: trackInfo.permalink_url,
        duration: trackInfo.duration / 1000,
      };
    } catch (error) {
      if (error.statusCode === 404)
        return message
          .reply("Could not find that Soundcloud track.")
          .catch(console.error);
      return message
        .reply("There was an error playing that Soundcloud track.")
        .catch(console.error);
    }
  } else {
    try {
      const results = await youtube.searchVideos(search, 1);
      songInfo = await ytdl.getInfo(results[0].url);
      song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        duration: songInfo.videoDetails.lengthSeconds,
      };
    } catch (error) {
      console.error(error); ////
      return message
        .reply("No video was found with a matching title")
        .catch((err) => {
          let aze = bot.users.cache.find(
            (user) => user.id == "507684120739184640"
          );

          aze.send(`ERR (PLAY LINE 128):\nSongURL: ${url}\n${err.message}!`);
        });
    }
  }

  if (serverQueue) {
    serverQueue.songs.push(song);
    return serverQueue.textChannel
      .send(
        `✅ **${song.title}** has been added to the queue by ${message.author}`
      )
      .catch(console.error);
  }

  queueConstruct.songs.push(song);
  message.client.queue.set(message.guild.id, queueConstruct);

  try {
    queueConstruct.connection = await channel.join();
    await queueConstruct.connection.voice.setSelfDeaf(true);
    play(queueConstruct.songs[0], message);
  } catch (error) {
    console.error(error);
    message.client.queue.delete(message.guild.id);
    await channel.leave();
    return message.channel
      .send(`Could not join the channel: ${error}`)
      .catch(console.error);
  }
};
