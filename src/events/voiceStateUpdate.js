const {MessageEmbed} = require("discord.js");
module.exports = {
    name: "voiceStateUpdate",
    async execute(client, old, new_) {
        if (new_.member.user.bot) return

        const logsChannel = await (
            await client.guilds.fetch(client.config.mainGuildId)).channels.fetch(client.config.logs.vocalChannelId)

        if (!old.channel && new_.channel) {
            await logsChannel.send({
                embeds: [
                    new MessageEmbed({
                        author: {
                            name: "Un membre a rejoint un salon vocal"
                        },
                        fields: [
                            {
                                name: "Utilisateur :",
                                value: `${new_.member.user.tag} (${new_.member.user.id})`,
                                inline: true
                            },
                            {
                                name: "Salon :",
                                value: `<#${new_.channelId}> (${new_.channelId})`,
                                inline: true
                            }
                        ],
                        timestamp: Date.now(),
                        color: "#0099ff"
                    })
                ]
            })
        } else if (old.channel && !new_.channel) {
            await logsChannel.send({
                embeds: [
                    new MessageEmbed({
                        author: {
                            name: "Un membre a quitté un salon vocal"
                        },
                        fields: [
                            {
                                name: "Utilisateur :",
                                value: `${new_.member.user.tag} (${new_.member.user.id})`,
                                inline: true
                            },
                            {
                                name: "Salon :",
                                value: `<#${old.channelId}> (${old.channelId})`,
                                inline: true
                            }
                        ],
                        timestamp: Date.now(),
                        color: "#ff1500"
                    })
                ]
            })
        }
    }
}