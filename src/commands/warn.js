const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageButton, MessageActionRow, Permissions } = require("discord.js")
const discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn quelqu\'un (ADMIN).')
    .addUserOption(option => option.setName("utilisateur").setDescription("L'utilisateur à warn").setRequired(true))
    .addStringOption(option => option.setName("raison").setDescription("La raison pour warn cet utilisateur").setRequired(true)),
	async execute(client, interaction) {
    
		const author = interaction.member;
		if (!author.roles.cache.some(client.config.roles.modRoleId) && !author.roles.cache.some(client.config.roles.adminRoleId)) {
			return interaction.reply({ content: `Vous n'avez pas le droit d'exécuter cette commande !`, ephemeral: true })
		}
    
    const user = interaction.options.getMember("utilisateur");
    
    if(user.bot) {
      return interaction.reply({ content: `Vous ne pouvez pas warn des bots.`, ephemeral: true })
    }
    
    if(author.id === user.id) {
      return interaction.reply({ content: `Vous ne pouvez pas vous warn vous-même.`, ephemeral: true })
    }
    
    const reason = interaction.options.getString("raison")
    
    let warnings = await client.warnsdb.get(`${interaction.guild.id}_${user.id}`, "warns")
    
    if(warnings === 3) {
      return interaction.reply({ content: `${user.username} a déjà 3 warnings.`, ephemeral: true })
    }
    
    if(!await client.warnsdb.has(`${interaction.guild.id}_${user.id}`, "warns")) {
      await client.warnsdb.set(`${interaction.guild.id}_${user.id}`, {warns: 1})
      user.send(`Vous avez été warn dans **${interaction.guild.name}** par ${author.user.username + "#" + author.user.discriminator} pour ${reason}`)
      return interaction.reply({ content: `Vous avez warn **${user.user.username + "#" + user.user.discriminator}** pour \`${reason}\``, ephemeral: true })
    } else {
      await client.warnsdb.set(`${interaction.guild.id}_${user.id}`, warnings + 1, "warns")
       user.send(`Vous avez été warn dans **${interaction.guild.name}** par ${author.user.username + "#" + author.user.discriminator} pour ${reason}`)
       interaction.reply({ content: `Vous avez warn **${user.user.username + "#" + user.user.discriminator}** pour \`${reason}\``, ephemeral: true })
      if (await client.warnsdb.get(`${interaction.guild.id}_${user.id}`, "warns") === 3) {
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
        interaction.followUp({ content: `Cet utilisateur a maintenant 3 warnings ! Voulez vous le bannir ?`, ephemeral: true, components: [row] })

          const filter = i => i.user.id === author.id;

          const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });
      
          const reason = interaction.options.getString('raison');
      
          collector.on('collect', async i => {
            if (i.customId === 'oui') {
              
              interaction.followUp({ content: `En train de bannir cet utilisateur...`, ephemeral: true })
              await user.send('Vous avez été banni de ' + interaction.guild.name + ' pour ' + reason + ".");
              user.ban({ reason: "3 warnings" })
              await interaction.followUp({ content: 'Vous avez banni ' + user.user.username + "#" + user.user.discriminator + ' avec succès !', components: [], ephemeral: true });
            }else{
              await interaction.followUp({ content: 'Opération annulée !', components: [], ephemeral: true });
            }
          });
        }
}}}