module.exports = {
  opt: {
    maxVol: 100,
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 1000,
    loopMessage: false,
    discordPlayer: {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
      },
    },
  },
};
