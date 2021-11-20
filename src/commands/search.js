const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Chercher une musique.')
        .addStringOption(option => option.setName('musique').setDescription('Le nom de la musique à chercher').setRequired(true)),
	async execute(client, interaction) {
        const res = await client.player.search(interaction.options.getString('musique'), {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return interaction.reply({content: `Aucun résultat trouvé pour "${interaction.options.getString('musique')}" ❌`, ephemeral: true});

        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });

        const embed = new MessageEmbed();

        embed.setColor('RED');
        embed.setAuthor(`Résultats pour "${interaction.options.getString('musique')}"`, client.user.displayAvatarURL({ size: 1024, dynamic: true }));

        const maxTracks = res.tracks.slice(0, 10);

        embed.setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\nSélectionnez entre **1** and **${maxTracks.length}** ou **annuler** ⬇️`);

        embed.setTimestamp();
        embed.setFooter('AstralMusic', interaction.user.avatarURL({ dynamic: true }));

        interaction.reply({ embeds: [embed] });

        const collector = interaction.channel.createMessageCollector({
            time: 15000,
            errors: ['time'],
            filter: m => m.author.id === interaction.user.id
        });

        collector.on('collect', async (query) => {
            query.delete();
            if (query.content.toLowerCase() === 'annuler') return interaction.followUp({content: "Recherche annulée ✅", ephemeral: true}) && collector.stop();

            const value = parseInt(query.content);

            if (!value || value <= 0 || value > maxTracks.length) return interaction.followUp({content: `Réponse invalide, essayez avec un nombre entre **1** et **${maxTracks.length}** ou **annuler**. ❌`, ephemeral: true});

            collector.stop();

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                await client.player.deleteQueue(interaction.guild.id);
                return interaction.followUp({content: `Je n'ai pas pu rejoindre ce salon vocal. ❌`, ephemeral: true});
            }

            await interaction.followUp({content: `Chargement de votre recherche... 🎧`, ephemeral: true});

            queue.addTrack(res.tracks[query.content - 1]);

            if (!queue.playing) await queue.play();
        });

        collector.on('end', (msg, reason) => {
            if (reason === 'time') return interaction.followUp({content: `Recherche écoulée ! ❌`, ephemeral: true});
        });
	},
};
