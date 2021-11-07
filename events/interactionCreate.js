const {Permissions, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const Canvas = require('canvas');
const getCaptcha = require("../functions/generateCaptcha")
Canvas.registerFont('fonts/Roboto.ttf', { family: 'Roboto' });
Canvas.registerFont('fonts/sans.ttf', { family: 'Sans' });

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

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
                const user = interaction.member.id;
                let author = await client.votesdb.get(interaction.message.id, "author")
                if (author === interaction.member.id) {
                    return interaction.reply({
                        content: "Vous ne pouvez pas voter à votre propre suggestion !",
                        ephemeral: true
                    })
                }
                let votes = await client.votesdb.get(interaction.message.id, "votes")
                votes = new Map(Object.entries(votes))
                let voteVal = 0
                if (interaction.customId === "upvote") voteVal = 1
                else voteVal = -1

                if (votes.has(user)) {
                    if (votes.get(user) !== voteVal) {
                        votes.set(user, voteVal)
                    } else {
                        votes.delete(user)
                    }
                } else {
                    votes.set(user, voteVal)
                }
                await client.votesdb.set(interaction.message.id, votes,  "votes")
                const voteTotal = (Array.from(votes.values())).reduce((a, b) => a + b, 0)

                const authorid = await client.votesdb.get(interaction.message.id, "author")

                const suggestionauthor = client.users.cache.find(user => user.id === authorid)

                const embed = new MessageEmbed()
                .setTitle(`Suggestion de ${suggestionauthor.name}`)
                .setColor("#0099ff")
                .setDescription(await client.votesdb.get(interaction.message.id, "suggestion"))
                .setThumbnail(suggestionauthor.avatarURL({ dynamic: true }))
                .setTimestamp(Date.now())
                .setFooter("Créez un thread pour débattre des suggestions !")
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setStyle("PRIMARY")
                            .setLabel(`Upvote`)
                            .setEmoji(":upvote:906184895611682826")
                            .setCustomId("upvote"),
                        new MessageButton()
                            .setStyle("SECONDARY")
                            .setLabel(voteTotal.toString())
                            .setDisabled(true)
                            .setCustomId("votenumbers"),
                        new MessageButton()
                            .setStyle("DANGER")
                            .setLabel(`Downvote`)
                            .setEmoji(":downvote:906184926146216006")
                            .setCustomId("downvote")
                    )
                await interaction.message.edit({ embeds: [embed], components: [row] })
                await interaction.deferUpdate()
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