const { MessageEmbed } = require("discord.js");
const cron = require("node-cron");
const updateSubCount = require("../functions/updateSubCount");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    client.logger.info(
      `Connecté à discord en tant que ${client.user.tag} (Id : ${client.user.id})`
    );

    const embed = new MessageEmbed().setAuthor("Bot en ligne !");
    const channel = await (
      await client.guilds.fetch(client.config.mainGuildId)
    ).channels.fetch(client.config.logs.botChannelId);
    await channel.send({ embeds: [embed] });

    const activities = [
      "s'abonner à Astral 🔔",
      `${
        (await client.guilds.fetch(client.config.mainGuildId)).memberCount
      } membres ! 🎉`,
      "RASTIQ & Léo-21",
      `Version ${client.config.version} 🚀`,
    ];

    const activprefix = ["PLAYING", "WATCHING", "WATCHING", "PLAYING"];

    // Repeat every 20 minutes
    cron.schedule("*/20 * * * *", async () => {
      await updateSubCount(client);
    });

    const setPresence = function (number) {
      client.user.setPresence({
        status: "dnd",
        activities: [{ name: activities[number], type: activprefix[number] }],
      });
    };

    let presenceCount = 0;

    setPresence(presenceCount);
    setInterval(() => {
      presenceCount++;
      if (presenceCount >= activities.length) presenceCount = 0;
      setPresence(presenceCount);
    }, 15000);
  },
};
