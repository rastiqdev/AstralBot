const { suggestionChannelId } = require("../config.json")
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "messageCreate",
    async execute(message) {
        if (message.author.bot) return

        if (message.channelId === suggestionChannelId && !message.content.startsWith("\\")) {
            const embed = new MessageEmbed()
                .setTitle(`Nouvelle suggetion de ${message.author.username}#${message.author.discriminator}`)
                .setColor("#0099ff")
                .setDescription(message.content)
                .setFooter("Créez un thread pour débattre des suggestions !")
                .setTimestamp(Date.now())
                .setThumbnail(message.author.avatarURL({ dynamic: true }))
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle("DANGER")
                        .setLabel("Supprimer")
                        .setEmoji("🗑️")
                        .setCustomId("delete_suggestion")
                )
            const msg = await message.channel.send({
                embeds: [embed],
                components: [row]
            })
            message.delete()
            await msg.react(":upvote:906184895611682826")
            await msg.react(":downvote:906184926146216006")
        }
    }
}