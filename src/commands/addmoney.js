const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addmoney')
		.setDescription('Ajouter de l\'argent à quelqu\'un. (ADMIN)')
        .addUserOption(option => option.setName('utilisateur').setDescription("La personne à qui ajouter de l'argent.").setRequired(true))
        .addIntegerOption(option => option.setName('montant').setDescription("Montant à ajouter.").setRequired(true)),
	async execute(client, interaction) {
        const author = interaction.member;
		if (!author.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
			return interaction.reply({ content: `Vous n'avez pas le droit d'exécuter cette commande !`, ephemeral: true })
		}
		let add = await client.eco.addMoney(interaction.options.getUser('utilisateur').id, interaction.guild.id, interaction.options.getInteger('montant'));
        return interaction.reply({content: `${interaction.options.getUser('utilisateur').tag} possède maintenant ${add.amount} AstralCoins.`, ephemeral: true});
	},
};