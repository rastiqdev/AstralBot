const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { EconomyManager } = require("quick.eco")
const { MongoClient } = require("mongodb");
const quickmongo = require("quickmongo");
const config = require('../res/config.json')

require('dotenv').config();

// Discord client
const client = new Client({     intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
], partials: ["CHANNEL"]});
client.config = config

// Mongo client
const mongo = new MongoClient(process.env.MONGOURL);

// Suggestion schema
const suggestionSchema = new quickmongo.Fields.ObjectField({
    author: new quickmongo.Fields.StringField(),
    votes: new quickmongo.Fields.AnyField()
});

// Counting schema
const countingSchema = new quickmongo.Fields.ObjectField({
    author: new quickmongo.Fields.StringField(),
    currentNumber: new quickmongo.Fields.NumberField()
});

// Warn schema

const warnSchema = new quickmongo.Fields.ObjectField({
    warns: new quickmongo.Fields.NumberField
});

mongo.connect()
    .then(() => {
        console.log("Connected to the database!");
    });
    const mongoCollection = mongo.db().collection("suggestions");

    client.votesdb = new quickmongo.Collection(mongoCollection, suggestionSchema);

    const countingCollection = mongo.db().collection("counting");

    client.countdb = new quickmongo.Collection(countingCollection, countingSchema);

    const warnCollection = mongo.db().collection("warns");

    client.warnsdb = new quickmongo.Collection(warnCollection, warnSchema);

    // db.set("userInfo", { difficulty: "Easy", items: [], balance: 0 }).then(console.log);
    // -> { difficulty: 'Easy', items: [], balance: 0 }

    // db.push("userInfo", "Sword", "items").then(console.log);
    // -> { difficulty: 'Easy', items: ['Sword'], balance: 0 }

    // db.set("userInfo", 500, "balance").then(console.log);
    // -> { difficulty: 'Easy', items: ['Sword'], balance: 500 }

    // Repeating previous examples:
    // db.push("userInfo", "Watch", "items").then(console.log);
    // -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 500 }

    // const previousBalance = await db.get("userInfo", "balance");
    // db.set("userInfo", previousBalance + 500, "balance").then(console.log);
    // -> { difficulty: 'Easy', items: ['Sword', 'Watch'], balance: 1000 }

    // Fetching individual properties
    // db.get("userInfo", "balance").then(console.log);
    // -> 1000
    // db.get("userInfo", "items").then(console.log);
    // -> ['Sword', 'Watch']

    // remove item
    // db.pull("userInfo", "Sword", "items").then(console.log);
    // -> { difficulty: 'Easy', items: ['Watch'], balance: 1000 }

// ECONOMY

client.eco = new EconomyManager({
    adapter: 'mongo',
    adapterOptions: {
        collection: 'money', // => Collection Name
        uri: process.env.MONGOURL // => Mongodb uri
    }
});

// COMMANDS
client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// EVENTS
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(client, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(client, ...args));
	}
}

client.login(process.env.TOKEN);
