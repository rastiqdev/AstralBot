const sendWelcomeImage = require('../functions/sendWelcomeImage');
const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "guildMemberAdd",
    async execute(client, member) {

        const embed = new MessageEmbed()
            .setAuthor("Un membre a rejoint le serveur")
            .setColor("#0099ff")
            .setTimestamp(Date.now())
            .setThumbnail(member.avatarURL({ dynamic: true }))
            .addField("Utilisateur :", `${member.id}`, true)
        const channel = await member.guild.channels.fetch(client.config.logs.joinsChannelId)
        await channel.send({embeds: [embed]})

        await sendWelcomeImage(client, member)
    }
}