const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
  //command here
  let memberID = msg.mentions.members.first().id;

  let member = msg.guild.members.cache.find((member) => member.id === memberID);
  if (msg.member.hasPermission("KICK_MEMBERS")) {
    if (member) {
      try {
        args.shift();
        args.shift();

        let reason = args.join(" ");
        if (!reason) reason = "No Given Reason!";
        member.kick(reason).then((member) => {
          msg.channel.send(
            new Discord.MessageEmbed().setDescription(
              `\`✔️\`| **${member.displayName}** has been kicked!  \`reason\`: **${reason}**`
            )
          );
        });
      } catch (err) {
        msg.channel
          .send("I do not have permissions to kick " + member.displayName)
          .then((message) => message.delete({ timeout: 5000 }));
      }
    }
  } else {
    msg.channel
      .send("You do not have permissions to kick " + member.displayName)
      .then((message) => message.delete({ timeout: 5000 }));
  }
  msg.delete();
};
module.exports.config = {
  name: "kick",
  aliases: ["kk", "k"],
  usage: "<Prefix>kick <Mention>",
  accessableby: "Who has kick members permissions",
};
