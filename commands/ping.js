const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Avoir le ping du bot.'),
	async execute(interaction) {
		return interaction.reply('Pong ! 🏓 ~' + client.ws.ping);
	},
};
