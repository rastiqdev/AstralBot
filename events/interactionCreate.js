const {Permissions, MessageEmbed, MessageAttachment, MessageActionRow, MessageButton, MessageSelectMenu } = require("discord.js");
const Canvas = require('canvas');
Canvas.registerFont('fonts/Roboto.ttf', { family: 'Roboto' });
Canvas.registerFont('fonts/sans.ttf', { family: 'Sans' });

getCaptcha = function() {
	let i;
    const canvas = Canvas.createCanvas(400, 180);
	const ctx = canvas.getContext('2d');
	const num = 5;
	const cords = [];
	const colors = ['blue', 'red', 'green', 'yellow', 'black', 'white'];
	let string = '';
	const particles = Math.floor(Math.random() * 101);
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	const charactersLength = characters.length;
	// Random code generation
	for (i = 0; i < 5; i++) {
		string += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	ctx.font = 'bold 100px Roboto';
	ctx.lineWidth = 7.5;
	let textPos = 45;
	// Captcha text
	for (i = 0; i < string.length; i++) {
		const char = string.charAt(i);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
		ctx.fillText(char, textPos, 120);
		textPos += 65;
	}
	// Paticles
	for (i = 0; i < particles; i++) {
		const pos = {
			width: Math.floor(Math.random() * canvas.width),
			height: Math.floor(Math.random() * canvas.height)
		};
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
		ctx.beginPath();
		ctx.arc(pos.width, pos.height, 3.5, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}
	// Get the cords
	let x = 0;
	for (i = 0; i < num + 1; i++) {
		const l = Math.floor(Math.random() * canvas.height);
		if (i !== 0) x += canvas.width / num;
		cords.push([x, l]);
	}
	// Strokes
	for (i = 0; i < cords.length; i++) {
		const cord = cords[i];
		const nextCord = cords[i + 1];
		const color = colors[Math.floor(Math.random() * colors.length)];
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(cord[0], cord[1]);
		if (nextCord) ctx.lineTo(nextCord[0], nextCord[1]);
		ctx.stroke();
	}
	return { buffer: canvas.toBuffer(), text: string };
};

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
                    let num = 1;
                    let time = num++;
                    await message.delete();
                    if (message.content !== captcha.text) {
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
                    }
                    if (message.content === captcha.text) {
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
                        content: "Rôles mis à jour !0",
                        ephemeral: true
                    })
                    return
                }
                await interaction.deferUpdate()
            }
        }
    }
}