const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resetwarns')
		.setDescription('Remettre à zéro les warns de quelqu\'un (ADMIN).')
    .addUserOption(option => option.setName("utilisateur").setDescription("L'utilisateur à qui enlever les warns").setRequired(true)),
	async execute(client, interaction) {
    
    
		const author = interaction.member;
		if (!author.roles.cache.some(client.config.roles.modRoleId) && !author.roles.cache.some(client.config.roles.adminRoleId)) {
			return interaction.reply({ content: `Vous n'avez pas le droit d'exécuter cette commande !`, ephemeral: true })
		}
    
    const user = interaction.options.getMember("utilisateur")
    
    if(user.bot) {
      return interaction.reply({ content: `Les bots n'ont pas de warns.`, ephemeral: true })
    }
    
    if(!await client.warnsdb.has(`${interaction.guild.id}_${user.id}`, "warns")) {
      return interaction.reply({ content: `${user.tag} n'a pas de warns.`, ephemeral: true })
    }
    
    await client.warnsdb.delete(`${interaction.guild.id}_${user.id}`)
    await interaction.reply({content: `Les warns de ${user.user.username + "#" + user.user.discriminator} ont été supprimés !`, ephemeral: true})
}
}