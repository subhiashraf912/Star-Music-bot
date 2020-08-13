const Discord = require("discord.js");
const colors = require("../../colors.json");

module.exports.run = async (bot, message, args, db) => {
  db.collection("servers")
    .doc(message.guild.id)
    .get()
    .then((q) => {
      let prefix = q.data().Prefix;
      console.log(`PREFIX IS ${prefix}....`);
      if (args[1]) {
        let command = args[1];
        if (bot.commands.has(command)) {
          command = bot.commands.get(command);
          var SHembed = new Discord.MessageEmbed()
            .setColor(colors.cyan)
            .setAuthor("TestBot Help", message.guild.iconURL())
            .setDescription(
              `The bot prefix is: ${prefix}\n\n**Command** ${
                command.config.name
              }\n**Description:** ${
                command.config.Description || "No Description"
              }\n**Usage:** ${
                command.config.usage || "No Usage"
              }\n**Accessable by:** ${
                command.config.accessableby || "Members"
              }\n**Aliases:** ${
                command.config.aliases || command.config.noalias
              }`
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
          .setDescription(
            `UPDATE: Setup leveling system by adding the leveling channels!\nThese are the avaliable commands for ${bot.user.username} bot\n The bot prefix is: ${prefix}`
          )
          .addField(
            "Moderation:",
            "``ban`` ``unban``  ``kick`` ``autoroles`` ``enable`` ``disable`` ``levelchannels`` ``dm`` "
          )
          .addField(
            "Emotes:",
            "``blush``  ``cry``  ``dance``  ``lewd``   ``pout``   ``shrug``  ``sleepy``  ``smile``  ``smug``  ``thumbsup``  ``wag``  ``thinking``  ``triggered``  ``teehee``  ``deredere``  ``thonking``  ``scoff``  ``happy``  ``thumbs``  ``grin``"
          )
          .addField(
            "actions:",
            "``cuddle`` ``hug`` ``insult`` ``kiss`` ``nom`` ``pat`` ``pet`` ``poke`` ``slap`` ``stare`` ``highfive`` ``bite`` ``greet`` ``punch`` ``handsholding`` ``kill`` ``hold`` ``pats`` ``wave``"
          )
          .addField(
            "Utility:",
            "``avatar`` ``prefix`` ``serverinfo`` ``profile`` ``welcomechannel`` ``welcomemessage`` ``level`` ``roles``"
          )
          .addField(
            "Cowoncy:",
            "``cowoncy`` ``cash`` ``give`` ``shop`` ``daily`` ``addcash``"
          )
          .addField("Anime and manga:", "``anime`` ``manga``")
          .addField(
            "Music:",
            "``play`` ``pause`` ``resume`` ``queue`` ``shuffle`` ``skip`` ``stop`` ``nowplaying``  ``loop`` ``lyrics`` ``remove`` ``search`` ``skipto`` ``volume``"
          )
          .setFooter(bot.user.username, bot.user.displayavatarURL);
        message.channel.send(Sembed);
        // message.author.send(Sembed);
      }
    });
};

module.exports.config = {
  name: "help",
  aliases: ["h", "halp", "commands"],
  noalias: "No Aliases",
  Description: "",
  accessableby: "Members",
  usage: "",
};
