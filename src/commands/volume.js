const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Changer le volume de la musique.')
        .addIntegerOption(option => option.setName('volume').setDescription('Nouveau volume.')),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});

        const vol = interaction.options.getInteger('volume')

        if (!vol) return interaction.reply({content: `Le volume actuel est ${queue.volume} 🔊\n*Pour changer le volume ajoutez un nombre entre **1** et **${client.musicconfig.opt.maxVol}** dans la commande.*`, ephemeral: true});

        if (queue.volume === vol) return interaction.reply({content: `Votre nouveau volume est l'ancien sont les mêmes. ❌`, ephemeral: true});

        if (vol < 0 || vol > client.musicconfig.opt.maxVol) return interaction.reply({content: `Le nombre spécifié est invalide. Entrez un nombre entre **1** et **${client.musicconfig.opt.maxVol}**. ❌`, ephemeral: true});

        const success = queue.setVolume(vol);

        return interaction.reply(success ? {content: `Le volume a été modifié à **${vol}**/**${client.musicconfig.opt.maxVol}**% 🔊`, ephemeral: true} : {content: `Quelque chose ne s'est pas passé comme prévu... ❌`, ephemeral: true});
	},
};
