const { MessageEmbed } = require("discord.js");
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports.config = {
  name: "search",
  Description: "Search and select videos to play",
};
module.exports.run = async (bot, message, args, prefix) => {
  args.shift();
  if (!args.length)
    return message
      .reply(`Usage: ${prefix} ${module.exports.config.name} <Video Name>`)
      .catch(console.error);
  if (message.channel.activeCollector)
    return message.reply(
      "A message collector is already active in this channel."
    );
  if (!message.member.voice.channel)
    return message
      .reply("You need to join a voice channel first!")
      .catch(console.error);

  const search = args.join(" ");

  let resultsEmbed = new MessageEmbed()
    .setTitle(`**Reply with the song number you want to play**`)
    .setDescription(`Results for: ${search}`)
    .setColor("#F8AA2A");

  try {
    const results = await youtube.searchVideos(search, 10);
    results.map((video, index) =>
      resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`)
    );

    var resultsMessage = await message.channel.send(resultsEmbed);

    function filter(msg) {
      const pattern = /(^[1-9][0-9]{0,1}$)/g;
      return (
        pattern.test(msg.content) &&
        parseInt(msg.content.match(pattern)[0]) <= 10
      );
    }

    message.channel.activeCollector = true;
    const response = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 30000,
      errors: ["time"],
    });
    const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
    console.log(choice);
    message.channel.activeCollector = false;
    const cmdModule =
      bot.commands.get("play".toLowerCase()) ||
      bot.aliases.get("p".toLowerCase());
    return cmdModule.run(bot, message, args, prefix, choice);

    resultsMessage.delete().catch(console.error);
  } catch (error) {
    console.error(error);
    message.channel.activeCollector = false;
  }
};
