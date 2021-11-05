const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const dotenv = require("dotenv")

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Connecté en tant que ' + client.user.username + "#" + client.user.discriminator + ' !');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'Une erreur s\'est produite pendant l\'exécution de cette commande !', ephemeral: true });
	}
});

dotenv.config()
if (!process.env.DISCORD_BOT_TOKEN) console.log("La variable d'environment 'DISCORD_BOT_TOKEN' n'existe pas.")
else client.login(process.env.DISCORD_BOT_TOKEN);
