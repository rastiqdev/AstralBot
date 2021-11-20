const { SlashCommandBuilder } = require('@discordjs/builders');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Jouer une musique.')
        .addStringOption(option => option.setName('musique').setDescription('Le nom ou l\'URL de la musique à chercher').setRequired(true)),
    voiceChannel: true,
	async execute(client, interaction) {
        const res = await client.player.search(interaction.options.getString('musique'), {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.reply({content: `Aucun résultat trouvé pour "${interaction.options.getString('musique')}" ❌`, ephemeral: true});

        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });

        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            await client.player.deleteQueue(interaction.guild.id);
            return interaction.reply({content: "Je n'ai pas pu rejoindre le salon vocal ! ❌", ephemeral: true});
        }

        await interaction.reply({content: `Chargement de votre ${res.playlist ? 'playlist' : 'musique'}... 🎧`});

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();
	},
};
