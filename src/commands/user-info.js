const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Avoir des informations à propos de quelqu\'un ou de soi-même.')
		.addUserOption(option => option.setName('utilisateur').setDescription('Utilisateur dont les informations doivent être montrées')),
	async execute(client, interaction) {
		const user = interaction.options.getUser('utilisateur') || interaction.user;
		const reply = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Informations d\'utilisateur')
			.setAuthor('AstralBot')
			.setThumbnail(user.displayAvatarURL())
			.addFields(
				{ name: 'Utilisateur', value: user.username + "#" + user.discriminator},
				{ name: 'ID', value: user.id},
			)
			.setTimestamp()
			.setFooter('Demandé par ' + interaction.user.username + "#" + interaction.user.discriminator, interaction.user.displayAvatarURL);
		return interaction.reply({ embeds: [reply] });
	},
};
