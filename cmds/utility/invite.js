const Discord = require("discord.js");
const colors = require("../../colors.json");

module.exports.run = async (bot, message, args) => {
  //command here

  let ClientId = bot.user.id;

  `https://discord.com/api/oauth2/authorize?client_id=711302633217851422&permissions=2147483639&scope=bot`;

  message.author.send(
    `Here's the bot invitation link...\nhttps://discord.com/api/oauth2/authorize?client_id=${ClientId}&permissions=2147483639&scope=bot`
  );
};
module.exports.config = {
  name: "invite",
  description:
    "gives you the bot invite link so you can add it in your own server",
  usage: "<Prefix> invite",
  aliases: ["link", "invitelink"],
};
