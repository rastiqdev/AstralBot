const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
Canvas.registerFont('fonts/Roboto.ttf', { family: 'Roboto' });
Canvas.registerFont('fonts/sans.ttf', { family: 'Sans' });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verifypanel')
		.setDescription('Envoie un panel pour les vérifs.'),
	async execute(client, interaction) {
		const user = interaction.user;
		const embed = new MessageEmbed()
			.setTitle(`Nouvelle suggetion de ${user.username}#${user.discriminator}`)
			.setColor("#0099ff")
			.setDescription(`${interaction.options.getString('chose')}`)
			.setFooter("Créez un thread pour débattre des suggestions !")
			.setTimestamp(Date.now())
			.setThumbnail(`${user.avatarURL({ dynamic: true })}`)
			const channel = client.channels.cache.get('906186926208479273');
			const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setStyle("DANGER")
					.setLabel("Supprimer")
					.setEmoji("🗑️")
					.setCustomId("delete_suggestion")
			)
			channel.send({embeds: [embed], components: [row]}).then(async msg => {
				await msg.react(":upvote:906184895611682826")
				await msg.react(":downvote:906184926146216006")
				interaction.reply({content: "Suggestion envoyée !", ephemeral: true})
			})
	},
};
