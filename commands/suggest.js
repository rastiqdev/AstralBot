const { SlashCommandBuilder } = require('@discordjs/builders');
const sendSuggestion = require("../functions/sendSuggestion")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Suggérer quelque chose.')
        .addStringOption(option => option.setName('suggestion').setDescription('Votre suggestion').setRequired(true)),
	async execute(client, interaction) {
        await sendSuggestion(interaction)
        interaction.reply({content: "Suggestion envoyée !", ephemeral: true})
	},
};
