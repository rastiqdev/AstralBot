const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warnings')
		.setDescription('Voir les warnings de quelqu\'un.')
    .addUserOption(option => option.setName("utilisateur").setDescription("L'utilsateur dont vous voulez voir les warns")),
	async execute(client, interaction) {
    const user = interaction.options.getMember("utilisateur") || interaction.member
    
  
    let warnings = await client.warnsdb.get(`${interaction.guild.id}_${user.id}`, "warns")
    
    
    if(!await client.warnsdb.has(`${interaction.guild.id}_${user.id}`, "warns")) warnings = 0;
    
    
    interaction.reply({content: `${user.user.username + "#" + user.user.discriminator} a **${warnings}** warning(s)`, ephemeral: true})
  
  }
}