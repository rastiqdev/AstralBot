const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,MessageActionRow,MessageButton,Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verifypanel')
		.setDescription('Envoie un panel pour les vérifs (ADMIN).'),
	async execute(client, interaction) {
		const author = interaction.member;
		if (!author.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			return interaction.reply({ content: `Vous n'avez pas le droit d'exécuter cette commande !`, ephemeral: true })
		}
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
