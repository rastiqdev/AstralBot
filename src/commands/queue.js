const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Voir les musique après la musique actuelle.'),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});

        if (!queue.tracks[0]) return interaction.reply({content: "Il n'y a pas de musique après celle-ci dans la queue.", ephemeral: true});

        const embed = new MessageEmbed();

        embed.setColor('RED');
        embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }));
        embed.setAuthor(`Queue - ${interaction.guild.name}`, client.user.displayAvatarURL({ size: 1024, dynamic: true }));

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (demandé par : ${track.requestedBy.username})`);

        const songs = queue.tracks.length;
        const nextSongs = songs > 5 ? `Et **${songs - 5}** autre musique(s)...` : `Dans la playlist, **${songs}** musiques(s)...`;

        embed.setDescription(`Musique actuelle - ${queue.current.title}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);

        embed.setTimestamp();
        embed.setFooter('AstralMusic', interaction.user.avatarURL({ dynamic: true }));

        interaction.channel.send({ embeds: [embed] });
	},
};
