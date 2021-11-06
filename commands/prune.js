const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete')
		.setDescription('Supprimer jusqu\'à 99 messages.')
		.addIntegerOption(option => option.setName('nombre').setDescription('Nombre de messages à supprimer.').setRequired(true)),
	async execute(client, interaction) {
		const author = interaction.member;
		if (!author.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
			return interaction.reply({ content: `Vous n'avez pas le droit d'exécuter cette commande !`, ephemeral: true })
		}

		const amount = interaction.options.getInteger('nombre');

		if (amount <= 1 || amount > 100) {
			return interaction.reply({ content: 'Vous devez entrer un nombre entre 1 et 99.', ephemeral: true });
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({ content: 'Je n\'ai pas pu supprimer les messages dans ce salon !', ephemeral: true });
		});

		return interaction.reply({ content: `\`${amount}\` messages ont été supprimés.`});
	},
};
