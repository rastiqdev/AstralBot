const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Avoir le ping du bot.'),
	async execute(client, interaction) {
		const sent = await interaction.reply({ content: 'Ping en cours...', fetchReply: true });
		interaction.editReply(`Pong ! 🏓 ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};
