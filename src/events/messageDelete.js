const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageDelete",
  async execute(client, message) {
    if ((!message.author && !message.content) || message.author.bot) return;
    if (
      message.channelId === client.config.verifChannelId ||
      message.channelId === client.config.logs.messagesChannelId
    )
      return;

    const embed = new MessageEmbed()
      .setAuthor(`Un message de  ${message.author.tag} a été supprimé`)
      .setColor("#ff1500")
      .setTimestamp(Date.now())
      .setTitle("Contenu du message :")
      .setThumbnail(message.author.avatarURL({ dynamic: true }))
      .addField("ID de l'auteur du message :", `${message.author.id}`, true)
      .addField("Salon :", `<#${message.channel.id}>`, true)
      .setDescription(message.content);

    const channel = await message.guild.channels.fetch(
      client.config.logs.messagesChannelId
    );
    await channel.send({ embeds: [embed] });
  },
};
