const {Permissions, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const getCaptcha = require("../functions/generateCaptcha")
const handleSuggestionVotes = require("../functions/handleSuggestionVotes")
const createTicket = require("../functions/createTicket")
const getChannelTranscript = require("../functions/getChannelTranscript")

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            if (command.voiceChannel) {
                if (!interaction.member.voice.channel) return interaction.reply({content: `${interaction.user}, vous n'êtes pas dans un salon vocal. ❌`, ephemeral: true});

                if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) return interaction.reply({content: `${interaction.user}, vous n'êtes pas dans le même salon vocal que moi. ❌`, ephemeral: true});
            }

            try {
                await command.execute(client, interaction);
            } catch (error) {
                console.error(error);
                return interaction.reply(
                    {content: 'Une erreur s\'est produite pendant l\'exécution de cette commande !', ephemeral: true});
            }
        } else if (interaction.isButton()) {
            if (interaction.customId === "commencer") {
                let invalid = 0;
                const captcha = getCaptcha();
                const { buffer } = captcha;
                const toggle = true;
                const attachment = new MessageAttachment(buffer, "captcha.png")
                const embed = new MessageEmbed()
                    .setTitle("(1/2) · Vérification anti-robot")
                    .setDescription("Vous n'êtes pas un robot ? Alors prouvez-le ! Pour cela, écrivez les lettres que " +
                        "vous voyez sur l'image ci-dessous, rien de plus simple !")
                    .setImage("attachment://captcha.png")
                    .setColor("#0099ff")
                    .setTimestamp(Date.now())
                await interaction.channel.permissionOverwrites.create(interaction.member, { SEND_MESSAGES: true })
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                    files: [attachment]
                });

                let filter = m => m.author.id === interaction.user.id;

                let collector = interaction.channel.createMessageCollector({ filter, time: 60000 });
                let fuckterval = setInterval(() => {
                    if (!interaction.guild.members.cache.get(interaction.user.id)) {
                        collector.stop();
                    }
                }, 3000);
            
                collector.on('collect', async message => {
                    if (!message.content) return;
                    await message.delete();
                    if (message.content.toUpperCase() !== captcha.text) {
                        invalid++;
                        if (invalid > 2 && toggle === true) {
                            if (interaction.member.kickable) {
                                await interaction.followUp({
                                    content: ':x: | **Trop d\'essais de captcha, kick de l\'utilisateur.**',
                                    ephemeral: true
                                });
                                interaction.member.send('Vous avez été kick pour trop d\'essais de captcha invalides');
                                await interaction.member.kick('Trop d\'essais de captcha invalides');
                                return;
                            }
                            collector.stop();
                            return;
                        }
                        await interaction.followUp({
                            content: `:x: | **Code invalide, veuillez réessayer. Il vous reste ${3 - invalid} essais**`,
                            ephemeral: true
                        });
                    } else {
                        try {
                            await interaction.channel.permissionOverwrites.create(interaction.member, { SEND_MESSAGES: false })
                            collector.stop();
                            const rearow = new MessageActionRow()
                            .addComponents(
                                new MessageSelectMenu()
                                    .setCustomId('selectsetup')
                                    .setPlaceholder('Rien de selectioné')
                                    .setMinValues(0)
                                    .setMaxValues(2)
                                    .addOptions([
                                        {
                                            label: 'Annonces',
                                            description: 'Annonces',
                                            value: 'Annonces',
                                        },
                                        {
                                            label: 'Vidéos & Lives',
                                            description: 'Vidéos & Lives',
                                            value: 'Vidéos',
                                        },
                                    ]),
                            );
                            const rearow2 = new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId("selectsetup_validation")
                                        .setLabel("Valider")
                                        .setStyle("SUCCESS")
                                )
                            const reaembed = new MessageEmbed()
                                .setTitle(`(2/2) · A présent, choisissez vos rôles de notification !`)
                                .setColor("#0099ff")
                                .setDescription("Maintenant que je suis sûr que vous n'êtes pas un robot, veuillez " +
                                "choisir ci-dessous les notifications que vous voulez recevoir (Vous pourrez toujours " +
                                "les changer plus tard).")
                            await interaction.followUp({embeds: [reaembed], components: [rearow, rearow2], ephemeral: true})
                        } catch (e) {
                            collector.stop();
                            await interaction.followUp({
                                content: ':x: | **Une erreur est survenue**',
                                ephemeral: true
                            });
                            console.error(e)
                        }
                    }
                });
                collector.on('end', async (collected, reason) => {
                    clearInterval(fuckterval);
                    if (reason === 'time' && toggle === true) {
                        if (interaction.member.kickable) {
                            await interaction.followUp({
                                content: '**L\'utilisateur à été kick pour ne pas avoir répondu à temps.**',
                                ephemeral: true
                            });
                            await interaction.member.kick('N\'a pas répondu au captcha à temps');
                        }
                    }
                });
            } else if (interaction.customId === "delete_suggestion") {
                if (interaction.member.id === interaction.message.member.id ||
                    interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    await interaction.deferUpdate()
                    await interaction.message.delete()
                } else {
                    await interaction.reply({ content: "Vous n'êtes pas autorisé(e) à supprimer ce message", ephemeral: true })
                }
            } else if (interaction.customId === "selectsetup_validation") {
                await interaction.member.roles.add("906149050510876674");
                await interaction.deferUpdate()
            } else if (interaction.customId === "upvote" || interaction.customId === "downvote") {
                await handleSuggestionVotes(interaction)
            } else if (interaction.customId === "create-ticket") {
                await createTicket(interaction)
            } else if (interaction.customId === "close-ticket") {
                await interaction.reply({
                    content: "Voulez-vous vraiment supprimer le ticket ? Cette action est irréversible",
                    components: [
                        new MessageActionRow()
                            .addComponents([
                                new MessageButton({
                                    label: "Supprimer le ticket",
                                    style: "SUCCESS",
                                    custom_id: "close-ticket-validation"
                                }),
                                new MessageButton({
                                    label: "Annuler",
                                    style: "DANGER",
                                    custom_id: "close-ticket-cancel"
                                })
                            ])
                    ],
                    ephemeral: true
                })
                const filter = i => i.user.id === interaction.user.id;
                const collector = interaction.channel.createMessageComponentCollector({ filter: filter, time: 15000 });

                collector.on("collect", async i => {
                    if (i.customId === "close-ticket-validation") {
                        const channelName = i.channel.name
                        const transcript = await getChannelTranscript(interaction.channel)
                        const attachment = new MessageAttachment(transcript, "transcription.txt")
                        if (interaction.channel && interaction.channel.deletable) await interaction.channel.delete()
                        await i.user.send({
                            embeds: [{
                                author: { name: "Ticket supprimé" },
                                description: `Vous avez supprimé le ticket \`${channelName}\`, voici la transcription ` +
                                    "des messages de celui-ci",
                                color: "#0099ff"
                            }]
                        })
                        await i.user.send({ files: [attachment] })

                        const logsChannel = await (
                            await client.guilds.fetch(client.config.mainGuildId)).channels.fetch(client.config.logs.ticketsChannelId)
                        await logsChannel.send({
                            embeds: [
                                new MessageEmbed({
                                    author: {
                                        name: "Ticket supprimé"
                                    },
                                    description: "La transcription des messages du ticket est disponible si-dessous.",
                                    fields: [
                                        {
                                            name: "Utilisateur :",
                                            value: `${i.user.tag} (${i.user.id})`,
                                            inline: true
                                        },
                                        {
                                            name: "Ticket :",
                                            value: channelName,
                                            inline: true
                                        }
                                    ],
                                    timestamp: Date.now(),
                                    color: "#ff1500"
                                })
                            ]
                        })
                        await logsChannel.send({ files: [attachment] })
                    } else if (i.customId === "close-ticket-cancel") {
                        await i.update({ content: "Opération annulée", components: [], ephemeral: true })
                    }
                })
            }else if (interaction.customId === "saveTrack") {
                const queue = client.player.getQueue(interaction.guildId);
                if (!queue || !queue.playing) return interaction.reply({ content: `Aucune musique est jouée. ❌`, ephemeral: true, components: [] });
    
                interaction.member.send(`Vous avez sauvegardé la musique ${queue.current.title} | ${queue.current.author} dans le serveur ${interaction.member.guild.name} ✅`).then(() => {
                    return interaction.reply({ content: `Je vous ai envoyé le nom de la musique en DM ✅`, ephemeral: true, components: [] });
                }).catch(() => {
                    return interaction.reply({ content: `Je n'ai pas réussi à vous envoyer un DM ❌`, ephemeral: true, components: [] });
                });
            }
        } else if (interaction.isSelectMenu()) {
            const { customId, values, member } = interaction;

            if (customId === 'select' || customId === "selectsetup") {
                const component = interaction.component
                const removed = component.options.filter((option) => {
                    return !values.includes(option.value)
                })

                for (const id of removed) {
                    await member.roles.remove(interaction.guild.roles.cache.find(role => role.name === id.value).id)
                }

                for (const id of values) {
                    await member.roles.add(interaction.guild.roles.cache.find(role => role.name === id).id)
                }

                if (customId === 'select') {
                    await interaction.reply({
                        content: "Rôles mis à jour !",
                        ephemeral: true
                    })
                    return
                }
                await interaction.deferUpdate()
            }
        }
    }
}