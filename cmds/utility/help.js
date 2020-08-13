const Discord = require("discord.js");
const colors = require("../../colors.json");

module.exports.run = async (bot, message, args) => {
  let prefix = process.env.prefix;
  console.log(`PREFIX IS ${prefix}....`);
  if (args[1]) {
    let command = args[1];
    if (bot.commands.has(command)) {
      command = bot.commands.get(command);
      var SHembed = new Discord.MessageEmbed()
        .setColor(colors.cyan)
        .setAuthor("Sen Commands", message.guild.iconURL())
        .setDescription(
          `The bot prefix is: ${prefix}\n\n**Command** ${
            command.config.name
          }\n**Description:** ${
            command.config.Description || "No Description"
          }\n**Usage:** ${
            command.config.usage || "No Usage"
          }\n**Accessable by:** ${
            command.config.accessableby || "Members"
          }\n**Aliases:** ${command.config.aliases || command.config.noalias}`
        );
      message.channel.send(SHembed);
    }
  }

  if (!args[1]) {
    let embed = new Discord.MessageEmbed()
      .setAuthor(`Help Command!`, message.guild.iconURL())
      .setColor(colors.red_dark)
      .setDescription(`${message.author.username} check your dms!!`);

    let Sembed = new Discord.MessageEmbed()
      .setColor(colors.cyan)
      .setAuthor(bot.user.username, message.guild.iconURL())
      .setThumbnail(bot.user.displayavatarURL)
      .setTimestamp()
      .addField("play(p)", "Plays audio/playlist from YouTube.", true)
      .addField("playlist(pl)", "Play a playlist from youtube.", true)
      .addField("pause(pa)", "Pause the currently playing music.", true)
      .addField("resume(r)", "Resume currently playing music.", true)
      .addField("queue(q)", "Show the music queue and now playing.", true)
      .addField("skip(s)", "Skip the currently playing song", true)
      .addField("stop(dc/leave)", "Stops the music.", true)
      .addField("nowplaying(np)", "Show now playing song.", true)
      .addField("loop(l)", "Toggle music loop.", true)
      .addField(
        "lyrics(ly)",
        "Get lyrics for the currently playing song.",
        true
      )
      .addField("remove(rv)", "Remove song from the queue.", true)
      .addField("search", "Search and select videos to play.", true)
      .addField("skipto(st)", "Skip to the selected queue number.", true)
      .addField("volume(v)", "Change volume of currently playing music.", true)

      .setFooter(bot.user.username, bot.user.displayavatarURL);
    message.channel.send(Sembed);
    // message.author.send(Sembed);
  }
};

module.exports.config = {
  name: "help",
  aliases: ["h", "halp", "commands"],
  noalias: "No Aliases",
  Description: "",
  accessableby: "Members",
  usage: "",
};
