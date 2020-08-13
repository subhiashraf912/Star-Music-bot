const { MessageEmbed, Message } = require("discord.js");
const { play } = require("../../include/play");
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const SOUNDCLOUD_CLIENT_ID = process.env.SOUNDCLOUD_CLIENT_ID;
const MAX_PLAYLIST_SIZE = process.env.MAX_PLAYLIST_SIZE;
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports.config = {
  name: "playlist",
  aliases: ["pl"],
  Description: "Play a playlist from youtube",
};
module.exports.run = async (bot, message, args, prefix) => {
  const PRUNING = false;
  const { channel } = message.member.voice;

  const serverQueue = message.client.queue.get(message.guild.id);
  if (serverQueue && channel !== message.guild.me.voice.channel)
    return message
      .reply(`You must be in the same channel as ${message.client.user}`)
      .catch(console.error);

  if (!args.length)
    return message
      .reply(
        `Usage: ${message.client.prefix}playlist <YouTube Playlist URL | Playlist Name>`
      )
      .catch(console.error);
  if (!channel)
    return message
      .reply("You need to join a voice channel first!")
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

  const search = args.join(" ");
  const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
  const url = args[0];
  const urlValid = pattern.test(args[0]);

  const queueConstruct = {
    textChannel: message.channel,
    channel,
    connection: null,
    songs: [],
    loop: false,
    volume: 100,
    playing: true,
  };

  let song = null;
  let playlist = null;
  let videos = [];

  if (urlValid) {
    try {
      playlist = await youtube.getPlaylist(url, { part: "snippet" });
      videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, {
        part: "snippet",
      });
    } catch (error) {
      console.error(error);
      return message.reply("Playlist not found :(").catch(console.error);
    }
  } else {
    try {
      const results = await youtube.searchPlaylists(search, 1, {
        part: "snippet",
      });
      playlist = results[0];
      videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, {
        part: "snippet",
      });
    } catch (error) {
      console.error(error);
      return message.reply("Playlist not found :(").catch(console.error);
    }
  }

  let embed = new MessageEmbed().setTitle(`Added Songs...`);
  let desc = "";
  let i = 0;
  videos.forEach((video) => {
    i++;
    song = {
      title: video.title,
      url: video.url,
      duration: video.durationSeconds,
    };

    if (serverQueue) {
      serverQueue.songs.push(song);
      if (!PRUNING) {
        desc = `${desc}\n**${i}-** \`${song.title}\` \`${song.duration}\``;
        embed.setDescription(desc);
        if (i === videos.length)
          message.channel.send(embed).catch(console.error);
      }
    } else {
      queueConstruct.songs.push(song);
    }
  });

  let playlistEmbed = new MessageEmbed()
    .setTitle(`${playlist.title}`)
    .setURL(playlist.url)
    .setColor("#F8AA2A")
    .setTimestamp();

  if (!PRUNING) {
    playlistEmbed.setDescription(
      queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`)
    );
    if (playlistEmbed.description.length >= 2048)
      playlistEmbed.description =
        playlistEmbed.description.substr(0, 2007) +
        "\nPlaylist larger than character limit...";
  }

  message.channel.send(`${message.author} Started a playlist`, playlistEmbed);

  if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

  if (!serverQueue) {
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
  }
};
