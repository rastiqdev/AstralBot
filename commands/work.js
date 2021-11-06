const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Travailler pour gagner de l\'argent dans l\'économie.'),
	async execute(client, interaction) {
		let previousAmount = await client.eco.fetchMoney(interaction.user.id, interaction.guild.id)
		let add = await client.eco.work(interaction.user.id, interaction.guild.id, false, ({range: [400, 600], timeout: 10000}));
        if (add.cooldown) return interaction.reply({content: `Vous avez déjà travaillé ! Revenez dans ${add.time.hours} heures et ${add.time.minutes} minutes.`});
        return interaction.reply(`Vous avez travaillé et gagné ${await client.eco.fetchMoney(interaction.user.id, interaction.guild.id) - previousAmount} AstralCoins et vous en avez maintenant ${add.amount}.`);
	},
};