const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageButton, MessageActionRow, Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Expulser un membre.')
		.addUserOption(option => option.setName('utilisateur').setDescription('Le membre à expulser').setRequired(true)),
	async execute(client, interaction) {
		const author = interaction.member;
		const user = interaction.options.getMember('utilisateur');
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('oui')
					.setLabel('Oui')
					.setStyle('SUCCESS'),
				new MessageButton()
					.setCustomId('non')
					.setLabel('Non')
					.setStyle('DANGER'),
			);
		if (!author.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
			return interaction.reply({ content: `Vous n'avez pas le droit d'exécuter cette commande !`, ephemeral: true })
		}
		interaction.reply({ content: 'Voulez-vous expulser ' + user.user.username + "#" + user.user.discriminator + ' ?', components: [row] })
		const filter = i => i.user.id === author.id;

		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

		collector.on('collect', async i => {
			if (i.customId === 'oui') {
				user.kick()
				await i.update({ content: 'Vous avez expulsé ' + user.user.username + "#" + user.user.discriminator + ' avec succès !', components: [] });
			}else{
				await i.update({ content: 'Opération annulée !', components: [] });
			}
		});
	},
};
