const {Permissions} = require("discord.js");
const Canvas = require('canvas');
const Discord = require('discord.js');
Canvas.registerFont('fonts/Roboto.ttf', { family: 'Roboto' });
Canvas.registerFont('fonts/sans.ttf', { family: 'Sans' });

getCaptcha = function() {
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
	for (var i = 0; i < 5; i++) {
		string += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	ctx.font = 'bold 100px Roboto';
	ctx.lineWidth = 7.5;
	let textPos = 45;
	// Captcha text
	for (var i = 0; i < string.length; i++) {
		const char = string.charAt(i);
		const color = colors[Math.floor(Math.random() * colors.length)];
		ctx.fillStyle = color;
		ctx.fillText(char, textPos, 120);
		textPos += 65;
	}
	// Paticles
	for (var i = 0; i < particles; i++) {
		const pos = {
			width: Math.floor(Math.random() * canvas.width),
			height: Math.floor(Math.random() * canvas.height)
		};
		const color = colors[Math.floor(Math.random() * colors.length)];
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(pos.width, pos.height, 3.5, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}
	// Get the cords
	let x = 0;
	for (var i = 0; i < num + 1; i++) {
		const l = Math.floor(Math.random() * canvas.height);
		if (i != 0) x += canvas.width / num;
		cords.push([x, l]);
	}
	// Strokes
	for (var i = 0; i < cords.length; i++) {
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
                var invalid = 0;
                interaction.member.roles.add("906150394940489749")
                const captcha = getCaptcha();
                const { buffer } = captcha;
                const file = new Discord.MessageAttachment(buffer);
                const toggle = true;
                interaction.reply({
                    content: `${interaction.user}, veuillez écrire ce captcha pour procéder à la vérification.`,
                    files: [
                        file
                    ], ephemeral: true
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
                    message.delete();
                    if (message.content != captcha.text) {
                        invalid++;
                        if (invalid > 2 && toggle === true) {
                            if (interaction.member.kickable) {
                                interaction.followUp({
                                    content: ':x: | **Trop d\'essais de captcha, kick de l\'utilisateur.**',
                                    ephemeral: true
                                });
                                interaction.member.send('Vous avez été kick pour trop d\'essais de captcha invalides');
                                interaction.member.kick('Trop d\'essais de captcha invalides');
                                return;
                            }
                            collector.stop();
                            return;
                        }
                        interaction.followUp({
                            content: `:x: | **Code invalide, veuillez réessayer. Il vous reste ${3 - invalid} essais**`,
                            ephemeral: true
                        });
                    }
                    if (message.content === captcha.text) {
                        try {
                            interaction.followUp({
                                content: '✅ | **Vérifié**',
                                ephemeral: true
                            });
                            message.member.roles.remove("906150394940489749");
                            collector.stop();
                            const rearow = new Discord.MessageActionRow()
                            .addComponents(
                                new Discord.MessageSelectMenu()
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
                            const reaembed = new Discord.MessageEmbed()
                                .setTitle(`A présent, choisissez vos rôles !`)
                                .setColor("#0099ff")
                                .setDescription(`Vous pouvez les sélectionner avec le select menu.`)
                                interaction.followUp({embeds: [reaembed], components: [rearow], ephemeral: true})
                        } catch (e) {
                            collector.stop();
                            interaction.followUp({
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
                            interaction.followUp({
                                content: '**L\'utilisateur à été kick pour ne pas avoir répondu à temps.**',
                                ephemeral: true
                            });
                            interaction.member.kick('N\'a pas répondu au captcha à temps');
                            return;
                        }
                        return;
                    }
                });
            }
            if (interaction.customId === "delete_suggestion") {
                if (interaction.member.id === interaction.message.member.id ||
                    interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
                    await interaction.deferUpdate()
                    await interaction.message.delete()
                } else {
                    await interaction.reply({ content: "Vous n'êtes pas autorisé(e) à supprimer ce message", ephemeral: true })
                }
            }
        }else if(interaction.isSelectMenu()) {
            const { customId, values, member } = interaction;

            if (customId === 'select') {
                const component = interaction.component
                const removed = component.options.filter((option) => {
                    return !values.includes(option.value)
                })

                for (const id of removed) {
                    member.roles.remove(interaction.guild.roles.cache.find(role => role.name === id.value).id);
                }

                for (const id of values) {
                    member.roles.add(interaction.guild.roles.cache.find(role => role.name === id).id);
                }

                interaction.reply({
                    content: "Roles mis à jour !",
                    ephemeral: true
                })
            }else if (customId === 'selectsetup') {
                const component = interaction.component
                const removed = component.options.filter((option) => {
                    return !values.includes(option.value)
                })

                for (const id of removed) {
                    member.roles.remove(interaction.guild.roles.cache.find(role => role.name === id.value).id)
                }

                for (const id of values) {
                    
                    member.roles.add(interaction.guild.roles.cache.find(role => role.name === id).id)
                }

                member.roles.add("906149050510876674");

                interaction.reply({
                    content: "Roles mis à jour, vous avez maintenant accès au serveur !",
                    ephemeral: true
                })
            }
        }
    }
}