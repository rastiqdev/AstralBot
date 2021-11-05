const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Avoir des informations à propos de quelqu\'un.')
		.addUserOption(option => option.setName('utilisateur').setDescription('Utilisateur dont les informations doivent être montrées')),
	async execute(interaction) {
		const user = interaction.options.getUser('utilisateur');
		const reply = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Informations d\'utilisateur')
			.setAuthor('AstralBot')
			.setThumbnail(interaction.options.getUser('utilisateur').displayAvatarURL())
			.addFields(
				{ name: 'Utilisateur', value: user.username + "#" + user.discriminator},
				{ name: 'ID', value: user.id},
			)
			.setTimestamp()
			.setFooter('Demandé par ' + interaction.user.username + "#" + interaction.user.discriminator, interaction.user.displayAvatarURL);
		return interaction.reply({ embeds: [reply] });
	},
};
