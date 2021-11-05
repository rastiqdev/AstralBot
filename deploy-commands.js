const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId } = require('./config.json');
const dotenv = require("dotenv");

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

dotenv.config()
if (!process.env.DISCORD_BOT_TOKEN) console.log("La variable d'environment 'DISCORD_BOT_TOKEN' n'existe pas.")
const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Commandes établies avec succès !'))
	.catch(console.error);
