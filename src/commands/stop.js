const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Arêter la musique.'),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});

        queue.destroy();

        interaction.reply({content: "Musique arrêtée, à la prochaine ! ✅", ephemeral: true});
	},
};
