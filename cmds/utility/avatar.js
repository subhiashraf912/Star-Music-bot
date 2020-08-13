const Discord = require("discord.js");
const colors = require("../../colors.json");

module.exports.run = async (bot, message, args, prefix) => {
  //command here
  const searchArgs = message.content.slice(prefix.length).trim().split(/ +/g);
  searchArgs.shift();
  let memberToSearch = searchArgs.join(" ");

  let member = message.guild.members.cache.find(
    (member) => member.id === memberToSearch
  );

  if (!member) {
    member = bot.users.cache.find((user) => user.tag === memberToSearch);
  }

  if (!member) {
    member = bot.users.cache.find((user) => user.username === memberToSearch);
  }

  if (!member) member = message.mentions.members.first();

  if (!member) member = message.author;

  let memberNick =
    member.displayName || member.username || member.user.username;

  let avatar;
  if (member.user) {
    avatar = member.user.avatarURL({ size: 1024 });
  } else {
    avatar = member.avatarURL({ size: 1024 });
  }

  const avatarEmbed = new Discord.MessageEmbed()

    .setColor(0x333333)
    .setAuthor(memberNick)
    .setImage(avatar);
  message.channel.send(avatarEmbed);
  // .setImage();
};
module.exports.config = {
  name: "avatar",
  description: "Displays user's avatar",
  usage: "<Prefix> avatar",
  aliases: ["pfp", "ppf"],
};
