const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,MessageActionRow,MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Suggérer quelque chose.')
        .addStringOption(option => option.setName('suggestion').setDescription('Votre suggestion').setRequired(true)),
	async execute(client, interaction) {
        const suggestion = interaction.options.getString('suggestion');
        const embed = new MessageEmbed()
            .setTitle(`Suggestion de ${interaction.user.tag}`)
            .setColor("#0099ff")
            .setDescription(suggestion)
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            .setTimestamp(Date.now())
            .setFooter("Créez un thread pour débattre des suggestions !")
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle("PRIMARY")
                    .setLabel(`Upvote`)
                    .setDisabled(true)
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
                    .setDisabled(true)
                    .setEmoji(":downvote:906184926146216006")
                    .setCustomId("downvote")
            )
        const newrow = new MessageActionRow()
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
        const msg = await interaction.channel.send({embeds: [embed], components: [row]})
        await client.votesdb.set(`${msg.id}`, {author: interaction.member.id, suggestion: suggestion, votes: []})
        msg.edit({embeds: [embed], components: [newrow]})
        interaction.reply({content: "Suggestion envoyée !", ephemeral: true})
	},
};
