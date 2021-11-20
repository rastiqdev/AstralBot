const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear la liste des musiques.'),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});

        if (!queue.tracks[0]) return interaction.reply({content: "Il n'y a pas de musique après celle-ci dans la queue.", ephemeral: true});

        queue.clear();

        interaction.reply({content: "La queue a été clear ! ✅", ephemeral: true});
	},
};
