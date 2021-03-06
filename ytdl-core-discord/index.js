const ytdl = require("ytdl-core");
const prism = require("prism-media");

function filter(format) {
  return (
    format.codecs === "opus" &&
    format.container === "webm" &&
    format.audioSampleRate == 250000
  );
}

/**
 * Tries to find the highest bitrate audio-only format. Failing that, will use any available audio format.
 * @private
 * @param {Object[]} formats The formats to select from
 */
function nextBestFormat(formats) {
  formats = formats
    .filter((format) => format.audioBitrate)
    .sort((a, b) => b.audioBitrate - a.audioBitrate);
  return formats.find((format) => !format.bitrate) || formats[0];
}

async function download(url, options = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      let info = await ytdl.getInfo(url);
      const format = info.formats.find(filter);
      const canDemux = format && info.videoDetails.lengthSeconds != 0;
      if (canDemux) options = { ...options, filter, quality: "highestaudio" };
      else if (info.videoDetails.lengthSeconds != 0)
        options = { ...options, filter: "audioonly", quality: "highestaudio" };
      if (canDemux) {
        const demuxer = new prism.opus.WebmDemuxer();
        return resolve(
          ytdl
            .downloadFromInfo(info, options)
            .pipe(demuxer)
            .on("end", () => demuxer.destroy())
        );
      } else {
        const bestFormat = nextBestFormat(info.formats);
        if (!bestFormat) return reject("No suitable format found");
        const transcoder = new prism.FFmpeg({
          args: [
            "-reconnect",
            "1",
            "-reconnect_streamed",
            "1",
            "-reconnect_delay_max",
            "5",
            "-i",
            bestFormat.url,
            "-analyzeduration",
            "0",
            "-loglevel",
            "0",
            "-f",
            "s16le",
            "-ar",
            "48000",
            "-ac",
            "2",
          ],
        });
        const opus = new prism.opus.Encoder({
          rate: 48000,
          channels: 2,
          frameSize: 960,
        });
        const stream = transcoder.pipe(opus);
        stream.on("close", () => {
          transcoder.destroy();
          opus.destroy();
        });
        return resolve(stream);
      }
    } catch (err) {
      if (err) return reject(err);
    }
    // Prefer opus
  });
}

module.exports = Object.assign(download, ytdl);
