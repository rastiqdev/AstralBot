const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

const commands = [];
const commandFiles = fs
  .readdirSync("./src/commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

rest
  .put(
    Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
    { body: commands }
  )
  // eslint-disable-next-line no-console
  .then(() => console.log("Commands établies avec succès !"))
  // eslint-disable-next-line no-console
  .catch(console.error);
