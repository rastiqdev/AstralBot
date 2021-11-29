const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { QueryType } = require('discord-player');
const ms = require('ms');
const { Lyrics } = require("@discord-player/extractor");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('Commandes pour le système de musique.')
        .addSubcommand(subcommand => subcommand.setName('play')
		.setDescription('Jouer une musique.')
        .addStringOption(option => option.setName('musique').setDescription('Le nom ou l\'URL de la musique à chercher').setRequired(true))).addSubcommand(subcommand => subcommand.setName('stop')
		.setDescription('Arêter la musique.')).addSubcommand(subcommand => subcommand.setName('pause')
		.setDescription('Mettre en pause la musique.')).addSubcommand(subcommand => subcommand.setName('resume')
		.setDescription('Reprendre la musique.')).addSubcommand(subcommand => subcommand.setName('search')
		.setDescription('Chercher une musique.')
        .addStringOption(option => option.setName('musique').setDescription('Le nom de la musique à chercher').setRequired(true))).addSubcommand(subcommand => subcommand.setName('skip')
		.setDescription('Passer cette musique.')).addSubcommand(subcommand => subcommand.setName('volume')
		.setDescription('Changer le volume de la musique.')
        .addIntegerOption(option => option.setName('volume').setDescription('Nouveau volume.'))).addSubcommandGroup(subcommandgroup => subcommandgroup.setName('filter').setDescription('Activer/Désactiver un filtre').addSubcommand(subcommand => subcommand.setName('bassboost')
		.setDescription('Activer/Désactiver le bassboost sur la musique actuelle.')
        .addBooleanOption(option => option.setName('toggle').setDescription('Toggle le mode bassboost ou pas').setRequired(true))).addSubcommand(subcommand => subcommand.setName('nightcore')
		.setDescription('Activer/Désactiver le mode nightcore sur la musique actuelle.')
        .addBooleanOption(option => option.setName('toggle').setDescription('Toggle le mode nightcore ou pas').setRequired(true))).addSubcommand(subcommand => subcommand.setName('earrape')
		.setDescription('Activer/Désactiver le mode earrape sur la musique actuelle.')
        .addBooleanOption(option => option.setName('toggle').setDescription('Toggle le mode earrape ou pas').setRequired(true))).addSubcommand(subcommand => subcommand.setName('8d')
		.setDescription('Activer/Désactiver le mode 8D sur la musique actuelle.')
        .addBooleanOption(option => option.setName('toggle').setDescription('Toggle le mode 8D ou pas').setRequired(true))).addSubcommand(subcommand => subcommand.setName('karaoke')
		.setDescription('Activer/Désactiver le mode karaoke sur la musique actuelle.')
        .addBooleanOption(option => option.setName('toggle').setDescription('Toggle le mode karaoke ou pas').setRequired(true)))).addSubcommand(subcommand => subcommand.setName('nowplaying')
		.setDescription('Avoir les informations de la musique actuelle.')).addSubcommand(subcommand => subcommand.setName('seek')
		.setDescription('Avancer/Reculer à une partie de la musique actuelle. (example : 3m 23s)')
        .addStringOption(option => option.setName('moment').setDescription('Le moment à avancer/reculer dans la musique').setRequired(true))).addSubcommand(subcommand => subcommand.setName('clear')
		.setDescription('Clear la liste des musiques.')).addSubcommand(subcommand => subcommand.setName('queue')
		.setDescription('Voir les musiques après la musique actuelle.')).addSubcommand(subcommand => subcommand.setName('lyrics')
		.setDescription('Voir les paroles de la musique actuelle.')),
	async execute(client, interaction) {
        const lyricsClient = Lyrics.init(client.config.geniusApiKey);
        if (interaction.options.getSubcommand() === "play") {
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
        }else if (interaction.options.getSubcommand() === "stop") {
            const queue = client.player.getQueue(interaction.guild.id);

            if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});
    
            queue.destroy();
    
            interaction.reply({content: "Musique arrêtée, à la prochaine ! ✅"});
        }else if (interaction.options.getSubcommand() === "pause") {
            const queue = client.player.getQueue(interaction.guild.id);

            if (!queue) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});
    
            const success = queue.setPaused(true);
    
            return interaction.reply(success ? {content: `La musique ${queue.current.title} a été mise en pause ✅`} : {content: `Quelque chose ne s'est pas passé comme prévu... ❌`, ephemeral: true});
        }else if (interaction.options.getSubcommand() === "resume") {
            const queue = client.player.getQueue(interaction.guild.id);

            if (!queue) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});
    
            const success = queue.setPaused(false);
    
            return interaction.reply(success ? {content: `La musique ${queue.current.title} a été reprise ✅`, ephemeral: true} : {content: `Quelque chose ne s'est pas passé comme prévu... ❌`, ephemeral: true});
        }else if (interaction.options.getSubcommand() === "search") {
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
        }else if (interaction.options.getSubcommand() === "skip") {
            const queue = client.player.getQueue(interaction.guild.id);

            if (!queue) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});
    
            const success = queue.skip();
    
            return interaction.reply(success ? {content: `La musique ${queue.current.title} a été skippée ! ✅`, ephemeral: true} : {content: `Quelque chose ne s'est pas passé comme prévu... ❌`, ephemeral: true});
        }else if(interaction.options.getSubcommand() === "volume") {
            const queue = client.player.getQueue(interaction.guild.id);

            if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});
    
            const vol = interaction.options.getInteger('volume')
    
            if (!vol) return interaction.reply({content: `Le volume actuel est ${queue.volume} 🔊\n*Pour changer le volume ajoutez un nombre entre **1** et **${client.musicconfig.opt.maxVol}** dans la commande.*`, ephemeral: true});
    
            if (queue.volume === vol) return interaction.reply({content: `Votre nouveau volume est l'ancien sont les mêmes. ❌`, ephemeral: true});
    
            if (vol < 0 || vol > client.musicconfig.opt.maxVol) return interaction.reply({content: `Le nombre spécifié est invalide. Entrez un nombre entre **1** et **${client.musicconfig.opt.maxVol}**. ❌`, ephemeral: true});
    
            const success = queue.setVolume(vol);
    
            return interaction.reply(success ? {content: `Le volume a été modifié à **${vol}**/**${client.musicconfig.opt.maxVol}**% 🔊`} : {content: `Quelque chose ne s'est pas passé comme prévu... ❌`, ephemeral: true});
        }else if (interaction.options.getSubcommand() === "bassboost") {
            const queue = client.player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});
            await queue.setFilters({
                bassboost: interaction.options.getBoolean('toggle')
            });
            return interaction.reply({ content: `🎵 | Bassboost ${interaction.options.getBoolean('toggle') ? 'activé' : 'désactivé'}! Veuillez patienter le temps que je modifie la musique...` });
        }else if (interaction.options.getSubcommand() === "nightcore") {
            const queue = client.player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});
            await queue.setFilters({
                nightcore: interaction.options.getBoolean('toggle')
            });
            return interaction.reply({ content: `🎵 | Nightcore ${interaction.options.getBoolean('toggle') ? 'activée' : 'désactivée'}! Veuillez patienter le temps que je modifie la musique...` });
        }else if (interaction.options.getSubcommand() === "earrape") {
            const queue = client.player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});
            await queue.setFilters({
                earrape: interaction.options.getBoolean('toggle')
            });
            return interaction.reply({ content: `🎵 | Earrape ${interaction.options.getBoolean('toggle') ? 'activé' : 'désactivé'} (attention les oreilles)! Veuillez patienter le temps que je modifie la musique...` });
        }else if (interaction.options.getSubcommand() === "8d") {
            const queue = client.player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});
            await queue.setFilters({
                "8D": interaction.options.getBoolean('toggle')
            });
            return interaction.reply({ content: `🎵 | 8D ${interaction.options.getBoolean('toggle') ? 'activé' : 'désactivé'}! Veuillez patienter le temps que je modifie la musique...` });
        }else if (interaction.options.getSubcommand() === "karaoke") {
            const queue = client.player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});
            await queue.setFilters({
                karaoke: interaction.options.getBoolean('toggle')
            });
            return interaction.reply({ content: `🎵 | Karaoke ${interaction.options.getBoolean('toggle') ? 'activé' : 'désactivé'}! Veuillez patienter le temps que je modifie la musique...` });
        }else if (interaction.options.getSubcommand() === "queue") {
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
        }else if(interaction.options.getSubcommand() === "nowplaying") {
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
            interaction.reply({ embeds: [embed], components: [row]});
        }else if (interaction.options.getSubcommand() === "clear") {
            const queue = client.player.getQueue(interaction.guild.id);

            if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});
    
            if (!queue.tracks[0]) return interaction.reply({content: "Il n'y a pas de musique après celle-ci dans la queue.", ephemeral: true});
    
            queue.clear();
    
            interaction.reply({content: "La queue a été clear ! ✅", ephemeral: true});
        }else if (interaction.options.getSubcommand() === "seek") {
            const queue = client.player.getQueue(interaction.guild.id);

            if (!queue || !queue.playing) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});

            const timeToMS = ms(interaction.options.getString('moment'));

            if (timeToMS >= queue.current.durationMS) return interaction.reply({content: "Temps invalide ou plus grand que la musique ! Veuillez essayer un temps comme 5s, 10s ou 1m. ❌", ephemeral: true});;
    
            await queue.seek(timeToMS);
    
            await interaction.reply(`Le moment de la musique a été mis à **${ms(timeToMS, { long: true })}** ✅`);
        }else if (interaction.options.getSubcommand() === "lyrics") {
            const queue = client.player.getQueue(interaction.guild.id);

            if (!queue) return interaction.reply({content: "Aucune musique n'est jouée. ❌", ephemeral: true});

            if (queue.current.url.includes("youtube") || queue.current.url.includes("youtu.be") || queue.current.url.includes("soundcloud.com")) {
                return interaction.reply({content: "Désolé, seules les musiques Spotify sont supportées pour le moment. ❌", ephemeral: true});
            }

            const track = queue.current;
    
            lyricsClient.search(track.author + " " + track.title)
            .then(lyrics => {
                const embed = new MessageEmbed()
                embed.setColor('RED');
                embed.setThumbnail(track.thumbnail);
                embed.setAuthor(track.title, client.user.displayAvatarURL({ size: 1024, dynamic: true }));
                embed.setTitle("Paroles :")
                embed.setTimestamp();
                embed.setFooter('AstralMusic', interaction.user.avatarURL({ dynamic: true }));
                embed.setDescription(lyrics.lyrics)
                return interaction.reply({embeds: [embed]})})
            .catch(console.error);
        }
	},
};
