const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "guildBanRemove",
  async execute(client, ban) {
    const embed = new MessageEmbed()
      .setAuthor("Membre dé-banni")
      .setColor("#84ff00")
      .setTimestamp(Date.now())
      .setThumbnail(ban.user.avatarURL({ dynamic: true }))
      .addField("Utilisateur :", `${ban.user.id}`, true)
      .addField("Raison du ban :", ban.reason, true);

    const channel = await ban.guild.channels.fetch(
      client.config.logs.modChannelId
    );
    await channel.send({ embeds: [embed] });
  },
};
