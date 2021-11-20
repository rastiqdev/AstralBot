const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Reprendre la musique.'),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});

        const success = queue.setPaused(false);

        return interaction.reply(success ? {content: `La musique ${queue.current.title} a été reprise ✅`, ephemeral: true} : {content: `Quelque chose ne s'est pas passé comme prévu... ❌`, ephemeral: true});
	},
};
