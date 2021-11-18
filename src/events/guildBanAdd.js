const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "guildBanAdd",
    async execute(client, ban) {
        if (ban.partial) ban = await ban.fetch()

        const embed = new MessageEmbed()
            .setAuthor(`Membre banni`)
            .setColor("#ff1500")
            .setTimestamp(Date.now())
            .setThumbnail(ban.user.avatarURL({ dynamic: true }))
            .addField("Utilisateur :", `${ban.user.id}`, true)
            .addField("Raison :", ban.reason, true)

        const channel = await ban.guild.channels.fetch(client.config.logs.modChannelId)
        await channel.send({ embeds: [embed] })
    }
}