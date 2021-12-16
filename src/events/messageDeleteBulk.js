const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "messageDeleteBulk",
  async execute(client, messages) {
    const embed = new MessageEmbed()
      .setAuthor(`${messages.size} messages supprimés en masse`)
      .addField("Salon :", `<#${messages.first().channel.id}>`)
      .setColor("#0099ff")
      .setTimestamp(Date.now())

    const channel = await client.channels.fetch(client.config.logs.modChannelId)
    await channel.send({ embeds: [embed] })
  }
}