const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('Avoir les informations de la musique actuelle.'),
	async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});

        const track = queue.current;

        const embed = new MessageEmbed();

        embed.setColor('RED');
        embed.setThumbnail(track.thumbnail);
        embed.setAuthor(track.title, client.user.displayAvatarURL({ size: 1024, dynamic: true }));

        const timestamp = queue.getPlayerTimestamp();
        const trackDuration = timestamp.progress == 'Infinity' ? 'infini (live)' : track.duration;

        embed.setDescription(`Volume : **${queue.volume}**%\nDurée **${trackDuration}**\nDemandé par ${track.requestedBy}`);

        embed.setTimestamp();
        embed.setFooter('AstralMusic', interaction.user.avatarURL({ dynamic: true }));

        const saveButton = new MessageButton();

        saveButton.setLabel('Sauvegarder cette musique');
        saveButton.setCustomId('saveTrack');
        saveButton.setStyle('SUCCESS');

        const row = new MessageActionRow().addComponents(saveButton);

        interaction.reply({ embeds: [embed], components: [row], ephemeral: true});
	},
};
