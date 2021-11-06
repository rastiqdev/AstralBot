const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,MessageActionRow,MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Suggérer quelque chose.')
        .addStringOption(option => option.setName('chose').setDescription('La chose à suggérer').setRequired(true)),
	async execute(client, interaction) {
        interaction.reply({content: "Suggestion envoyée !", ephemeral: true})
        const suggestion = interaction.options.getString('chose');
        const author = interaction.user.tag;
            const embed = new MessageEmbed()
                .setTitle(`Suggestion de ${author}`)
                .setColor("#0099ff")
                .setDescription(`${suggestion}`)
                const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle("DANGER")
                        .setLabel("Downvote")
                        .setDisabled(true)
                        .setCustomId("downvote"),
                    new MessageButton()
                        .setStyle("SECONDARY")
                        .setLabel("0")
                        .setDisabled(true)
                        .setCustomId("votenumbers"),
                    new MessageButton()
                        .setStyle("SUCCESS")
                        .setLabel("Upvote")
                        .setDisabled(true)
                        .setCustomId("upvote")
                )
                const newrow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle("DANGER")
                        .setLabel("Downvote")
                        .setCustomId("downvote"),
                    new MessageButton()
                        .setStyle("SECONDARY")
                        .setLabel("0")
                        .setDisabled(true)
                        .setCustomId("votenumbers"),
                    new MessageButton()
                        .setStyle("SUCCESS")
                        .setLabel("Upvote")
                        .setCustomId("upvote")
                )
                interaction.channel.send({embeds: [embed], components: [row]}).then(async msg => {
                    client.votesdb.set(`${msg.id}`, {author: author, suggestion: suggestion, votes: 0})
                    msg.edit({embeds: [embed], components: [newrow]})
                })
	},
};
