const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "guildMemberRemove",
    async execute(client, member) {
        console.log("test")
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });
        const kickLog = fetchedLogs.entries.first();

        if (kickLog) {
            let {executor, target, reason} = kickLog;
            if (target.id === member.id) {
                if (!reason) reason = "Aucune raison spécifiée"

                const embed = new MessageEmbed()
                    .setAuthor("Membre expulsé")
                    .setColor("#ff1500")
                    .setTimestamp(Date.now())
                    .setThumbnail(target.avatarURL({dynamic: true}))
                    .addField("Utilisateur :", `${target.id}`, true)
                    .addField("Modérateur :", `<@${executor.id}>`, true)
                    .addField("Raison :", reason, true)

                const channel = await member.guild.channels.fetch(client.config.logs.modChannelId)
                await channel.send({embeds: [embed]})
                return
            }
        }
        const embed = new MessageEmbed()
            .setAuthor("Un membre a quitté le serveur")
            .setColor("#0099ff")
            .setTimestamp(Date.now())
            .setThumbnail(member.avatarURL({ dynamic: true }))
            .addField("Utilisateur :", `${member.id}`, true)
        const channel = await member.guild.channels.fetch(client.config.logs.joinsChannelId)
        await channel.send({embeds: [embed]})
    }
}