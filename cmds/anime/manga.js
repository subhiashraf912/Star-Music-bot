const Discord = require("discord.js");
const kitsu = require("node-kitsu");

module.exports.run = function (bot, message, argument) {
  let msgcontent = message.content;
  const searchArgs = msgcontent.slice(prefix.length).trim().split(/ +/g);
  searchArgs.shift();
  let searchMessage = searchArgs.join(" ");
  console.log(searchMessage);
  if (!searchMessage || searchMessage === "")
    return message.reply(`Enter manga name to search about!`);

  kitsu
    .searchManga(searchMessage, 0)
    .catch((err) => message.channel.send(`Error happend: \`${err.message}\``))
    .then((results) => {
      searchResult = results[0];
      console.log(searchResult);
      if (!searchResult) {
        message.channel.send("Manga Not Found");
      } else {
        var animeID = searchResult.id;
        var en = searchResult.attributes.titles.en;
        if (!en) {
          en = "English title Not Found.";
        }
        var en_jp = searchResult.attributes.titles.en_jp;
        var ja_jp = searchResult.attributes.titles.ja_jp;
        if (!en_jp) {
          titleJP = "Japanese title Not Found.";
        }
        var title = searchResult.attributes.canonicalTitle;
        if (!title) {
          if (!en) {
            title = en_jp;
          } else if (!en_jp) {
            title = ja_jp;
          } else {
            title = "Canon Title Not Found.";
          }
        }
        var synopsis = searchResult.attributes.synopsis;
        if (!synopsis) {
          synopsis = "No Synopsis Found";
        }
        var episodeCount = searchResult.attributes.episodeCount;
        if (!episodeCount) {
          episodeCount = "Unknown";
        }
        var episodeLength = searchResult.attributes.episodeLength;
        if (!episodeLength) {
          episodeLength = "Unknown";
        }

        var status = searchResult.attributes.status;
        var totalLength = searchResult.attributes.totalLength;
        if (!totalLength) totalLength = "UNKNOWN";
        var startDate = searchResult.attributes.createdAt;
        var ageRatingGuide = searchResult.attributes.ageRatingGuide;
        var ChapterCount = searchResult.attributes.chapterCount;
        if (!ChapterCount) ChapterCount = "UNKNOWN";
        if (!ageRatingGuide) ageRatingGuide = "UNKNOWN";
        if (!startDate) {
          startDate = "Unknown";
        }
        var endDate = searchResult.attributes.updatedAt;
        if (!endDate) {
          endDate = "Unknown";
        }
        var smallPoster = searchResult.attributes.posterImage.original;

        var statusUpper =
          status.charAt(0).toUpperCase() + status.substr(1).toLowerCase();

        let embed = new Discord.MessageEmbed()
          .setTitle(title)
          .addField(
            `Other names:`,
            `**English:** \`${en}\`\n**English JP:** \`${en_jp}\`\n**Japan:** \`${ja_jp}\``
          )

          .addField(`Chapter Count:`, `${ChapterCount} Chapters`)
          .addField(`Created at:`, `${startDate}`, true)
          .addField(`Last update:`, `${endDate}`, true)
          .addField(`Age Rating Guide:`, `${ageRatingGuide}`)
          .setColor(`RANDOM`)
          .setDescription(synopsis)
          .setThumbnail(smallPoster)
          .setFooter(
            `data from: Kitsu APIs , Tysm Laknicek for helping in Search issues<3`
          );
        if (searchResult.attributes.coverImage) {
          var coverImage = searchResult.attributes.coverImage.original;
          embed.setImage(coverImage);
        }
        message.channel.send(embed);
      } //END if !searchresults
    }); //END searchAnime
};

module.exports.config = {
  name: "manga",
  aliases: ["searchmanga", "mangasearch", "findmanga"],
  Description: "searches about the manga u want!",
  usage: `\n**PREFIX** manga **MANGA NAME**`,
};
