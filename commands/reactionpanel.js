const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,MessageActionRow,MessageSelectMenu } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactionpanel')
		.setDescription('Envoie un panel pour les vérifs.'),
	async execute(client, interaction) {
		const row = new MessageActionRow()
		.addComponents(
			new MessageSelectMenu()
				.setCustomId('select')
				.setPlaceholder('Rien de selectioné')
				.setMinValues(0)
				.setMaxValues(2)
				.addOptions([
					{
						label: 'Annonces',
						description: 'Annonces',
						value: 'Annonces',
					},
					{
						label: 'Vidéos & Lives',
						description: 'Vidéos & Lives',
						value: 'Vidéos',
					},
				]),
		);
		const embed = new MessageEmbed()
			.setTitle(`Choisissez vos rôles ici !`)
			.setColor("#0099ff")
			.setDescription(`Vous pouvez les sélectionner avec le select menu.`)
			interaction.channel.send({embeds: [embed], components: [row]}).then(async msg => {
				interaction.reply({content: "Panel envoyé !", ephemeral: true})
			})
	},
};
