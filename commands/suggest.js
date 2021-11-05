const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed,MessageActionRow,MessageButton } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Suggérer quelque chose.')
        .addStringOption(option => option.setName('chose').setDescription('La chose à suggérer').setRequired(true)),
	async execute(client, interaction) {
        const user = interaction.user;
            const embed = new MessageEmbed()
                .setTitle(`Bienvenue dans ${interaction.guild.name}`)
                .setColor("#0099ff")
                .setDescription(`Cliquez sur le bouton ci-dessous pour commencer la vérification.`)
                const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setStyle("SUCCESS")
                        .setLabel("Commencer")
                        .setEmoji("✅")
                        .setCustomId("commencer")
                )
                channel.send({embeds: [embed], components: [row]}).then(async msg => {
                    await msg.react(":upvote:906184895611682826")
                    await msg.react(":downvote:906184926146216006")
                    interaction.reply({content: "Suggestion envoyée !", ephemeral: true})
                })
	},
};
