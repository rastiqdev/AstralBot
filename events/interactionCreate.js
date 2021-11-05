const {Permissions} = require("discord.js");

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
                const clear = function(channel) {
                    channel.bulkDelete(channel.messages.cache.size - 1)
                }
                interaction.member.roles.add("906150394940489749")
                const captcha = client.captcha();

                interaction.channel.send(`${interaciton.user}, veuillez écrire ce captcha pour procéder à la vérification.`, {
                    files: [
                        {
                            name: 'captcha.png',
                            attachment: buffer
                        }
                    ]
                });

                let filter = m => m.author.id === interaction.user.id;

                let collector = new Discord.MessageCollector(channel, filter, {
                    max: 11,
                    time: 60000
                });
                let fuckterval = setInterval(() => {
                    if (!interaction.guild.members.cache.get(interaction.user.id)) {
                        clear(interaction.channel)
                        collector.stop();
                    }
                }, 3000);
            
                collector.on('collect', async message => {
                    if (!message.content) return;
                    let num = 1;
                    let time = num++;
                    if (message.content != captcha.text) {
                        invalid++;
                        if (invalid > 9 && toggle === true) {
                            if (interaction.member.kickable) {
                                message.channel.send(
                                    ':x: | **Trop d\'essais de captcha, kick de l\'utilisateur.**'
                                );
                                interaction.member.kick('Trop d\'essais de captcha invalides');
                                clear(interaction.channel)
                                return;
                            }
                            collector.stop();
                            return;
                        }
                        message.channel.send(
                            `:x: | **Code invalide, veuillez réessayer. Il vous reste ${10 - invalid} essais**`
                        );
                    }
                    if (message.content === captcha.text) {
                        try {
                            message.channel.send('✅ | **Vérifié**');
                            message.member.roles.remove("906150394940489749")
                            message.member.roles.add("906149050510876674");
                            clear(interaction.channel)
                            collector.stop();
                        } catch {
                            clear(interaction.channel)
                            collector.stop();
                            message.channel.send(':x: | **Une erreur est survenue**');
                        }
                    }
                });
                collector.on('end', async (collected, reason) => {
                    clearInterval(fuckterval);
                    if (reason === 'time' && toggle === true) {
                        if (interaction.member.kickable) {
                            interaction.channel.send(
                                `**L\'utilisateur à été kick pour ne pas avoir répondu à temps.**`
                            );
                            interaction.member.kick('N\'a pas répondu au captcha à temps');
                            clear(interaction.channel)
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
        }
    }
}