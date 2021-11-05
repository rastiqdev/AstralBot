const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,MessageActionRow,MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verifypanel')
		.setDescription('Envoie un panel pour les vérifs.'),
	async execute(client, interaction) {
		const user = interaction.user;
		const embed = new MessageEmbed()
			.setTitle(`Vérification`)
			.setColor("#0099ff")
			.setDescription(`Veuillez cliquer sur le bouton ci-dessous pour avoir accès au serveur !`)
			const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setStyle("SUCCESS")
					.setLabel("Vérification")
					.setCustomId("commencer")
			)
			interaction.channel.send({embeds: [embed], components: [row]}).then(async () => {
				interaction.reply({content: "Panel envoyé !", ephemeral: true})
			})
	},
};
