module.exports = async (bot) => {
  // let aze = bot.users.cache.find("507684120739184640");
  let aze = bot.users.cache.find((user) => user.id == "507684120739184640");

  aze.send(`Bot is online!`);




  bot.user
    .setActivity(`${process.env.prefix}help`, { type: "WATCHING" })
    .catch(console.error);

  //  bot.user.setPresence({
  //     game: {
  //       name: `${process.env.prefix}help`,
  //       type: "WATCHING",
  //       url: "https://www.youtube.com/channel/UCBhYjzZWW-4vM-dHz9eQimg",
  //     },
  //   });
};
