const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");

module.exports = sendSuggestion = async function(interaction) {
    let suggestion
    if (interaction.options) suggestion = interaction.options.getString('suggestion');
    else suggestion = interaction.content
    const embed = new MessageEmbed()
        .setTitle(`Suggestion de ${interaction.member.user.tag}`)
        .setColor("#0099ff")
        .setDescription(suggestion)
        .setThumbnail(interaction.member.user.avatarURL({ dynamic: true }))
        .setTimestamp(Date.now())
        .setFooter("Créez un thread pour débattre des suggestions !")
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("PRIMARY")
                .setLabel(`Upvote`)
                .setEmoji(":upvote:906184895611682826")
                .setCustomId("upvote"),
            new MessageButton()
                .setStyle("SECONDARY")
                .setLabel("0")
                .setDisabled(true)
                .setCustomId("votenumbers"),
            new MessageButton()
                .setStyle("DANGER")
                .setLabel(`Downvote`)
                .setEmoji(":downvote:906184926146216006")
                .setCustomId("downvote")
        )
    const msg = await (await interaction.client.channels.fetch(interaction.client.config.suggestionChannelId)).send({embeds: [embed], components: [row]})
    await interaction.client.votesdb.set(`${msg.id}`, {author: interaction.member.id, votes: []})
}