const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageUpdate",
  async execute(client, old, new_) {
    if (
      new_.channelId === client.config.verifChannelId ||
      new_.channelId === client.config.logs.messagesChannelId ||
      new_.author.bot
    )
      return;

    const embed = new MessageEmbed()
      .setAuthor(`Message modifié par ${new_.author.tag}`)
      .setColor("#0099ff")
      .setTimestamp(Date.now())
      .setTitle("Contenu de l'ancien message :")
      .setThumbnail(new_.author.avatarURL({ dynamic: true }))
      .addField("ID de l'auteur du message :", `${new_.author.id}`, true)
      .addField("Lien du message :", old.url, true);

    if (old.content) {
      embed.setDescription(old.content);
    } else {
      embed.setDescription("Ancien contenu du message indisponible");
    }

    const channel = await new_.guild.channels.fetch(
      client.config.logs.messagesChannelId
    );
    await channel.send({ embeds: [embed] });
  },
};
