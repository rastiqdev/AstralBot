const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Avoir le ping du bot.'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Ping en cours...', fetchReply: true });
		interaction.editReply(`Pong ! 🏓 ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};
