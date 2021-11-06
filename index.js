const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
require('dotenv').config();
const { EconomyManager } = require("quick.eco")
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.eco = new EconomyManager({
    adapter: 'mongo',
    adapterOptions: {
        collection: 'money', // => Collection Name
        uri: process.env.MONGOURL // => Mongodb uri
    }
});

// COMMANDS
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// EVENTS
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

client.login(process.env.TOKEN);
