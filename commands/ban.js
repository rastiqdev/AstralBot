const { SlashCommandBuilder,MessageButton } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Bannir un membre.')
		.addUserOption(option => option.setName('utilisateur').setDescription('Le membre à bannir').setRequired(true)),
	async execute(interaction) {
		const author = interaction.member;
		const user = interaction.options.getMember('utilisateur');
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('oui')
					.setLabel('Oui')
					.setStyle('SUCCESS'),
				new MessaegeButton()
					.setCustomId('non')
					.setLabel('Non')
					.setStyle('DANGER'),
			);
		if (!author.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
			return interaction.reply({ content: `Vous n'avez pas le droit d'exécuter cette commande !`, ephemeral: true })
		}
		interaction.reply({ content: 'Voulez-vous bannir ' + user.user.username + "#" + user.user.discriminator + ' ?', components: [row] })
		const filter = i => i.user.id === author.id;

		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

		collector.on('collect', async i => {
			if (i.customId === 'oui') {
				user.kick()
				await i.update({ content: 'Vous avez banni ' + user.user.username + "#" + user.user.discriminator + ' avec succès !', components: [] });
			}else{
				await i.update({ content: 'Opération annulée !', components: [] });
			}
		});
	},
};
