const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "messageUpdate",
    async execute(client, old, new_) {
        if (new_.channelId === client.config.verifChannelId ||
            new_.channelId === client.config.logs.messagesChannelId || 
            new_.channel.parentId === new_.guild.channels.cache.find(x => x.name === "ModMail").id) return

        const embed = new MessageEmbed()
            .setAuthor(`Logs`)
            .setColor("#0099ff")
            .setTimestamp(Date.now())
            .setTitle(`Message modifié par ${new_.author.tag}`)
            .setThumbnail(new_.author.avatarURL({ dynamic: true }))
            .addField("ID de l'auteur du message :", `${new_.author.id}`, true)
            .addField("Lien du message :", old.url, true)

        if (old.content) {
            embed.addField("Ancien contenu du message :", `${new_.content}`)
            embed.addField("Nouveau contenu du message :", `${new_.content}`)
        } else {
            embed.addField("Ancien contenu du message :", "Ancien contenu du message indisponible")
            embed.addField("Ancien contenu du message :", `${new_.content}`)
        }

        const channel = await new_.guild.channels.fetch(client.config.logs.messagesChannelId)
        await channel.send({ embeds: [embed] })
    }
}